import { redirect } from "next/navigation";
import { appClient } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  const session = await appClient.getSession();

  if (!session?.user?.org_id) {
    // If we have a user but no org_id, they might be in the middle of onboarding or something is wrong.
    // Ideally we redirect them or show an error.
    // For now, let's just assume they need to login or select an org.
    // If really strictly unauthenticated, middleware would catch it, but org_id check is app specific.
    return <div>Unauthorized: No Organization Context</div>;
  }

  const orgId = session.user.org_id;

  // 1. Get Organization ID from DB (to ensure it exists and get internal ID)
  const organization = await prisma.organization.findUnique({
    where: { auth0OrgId: orgId },
  });

  // If org doesn't exist in our DB yet, we can't show stats.
  // The event creation endpoint handles lazy creation, but dashboard should probably be empty.
  if (!organization) {
    return (
      <DashboardContent
        stats={{
          totalEvents: 0,
          pendingPurchases: 0,
          totalTicketsSold: 0,
          revenue: 0,
        }}
        recentEvents={[]}
      />
    );
  }

  // 2. Parallel data fetching for stats
  const [totalEvents, pendingPurchases, approvedPurchases, recentEvents] =
    await Promise.all([
      // Total Events
      prisma.event.count({
        where: { organizationId: organization.id },
      }),

      // Pending Purchases
      prisma.purchase.count({
        where: {
          event: { organizationId: organization.id },
          status: "PENDING",
        },
      }),

      // Approved Purchases (for count and revenue)
      // Note: aggregations can be heavy, but usually faster than fetching all rows.
      prisma.purchase.findMany({
        where: {
          event: { organizationId: organization.id },
          status: "APPROVED",
        },
        select: {
          quantity: true,
          totalAmount: true,
        },
      }),

      // Recent Events (Limit 5)
      prisma.event.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          ticketTypes: {
            select: { sold: true },
          },
        },
      }),
    ]);

  // Calculate generic stats from the "approvedPurchases" array
  // If this grows too large, we should use prisma.aggregate, but aggregate returns Decimal
  // which is annoying to pass to client components (needs serializing).
  // For now, this is already 100x better than fetching generic "ALL purchases".

  const totalTicketsSold = approvedPurchases.reduce(
    (sum, p) => sum + p.quantity,
    0,
  );
  const revenue = approvedPurchases.reduce(
    (sum, p) => sum + Number(p.totalAmount),
    0,
  );

  // Serialize dates for Client Component
  const formattedRecentEvents = recentEvents.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <DashboardContent
      stats={{
        totalEvents,
        pendingPurchases,
        totalTicketsSold,
        revenue,
      }}
      recentEvents={formattedRecentEvents}
    />
  );
}
