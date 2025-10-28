"use client"

import { useState, useEffect } from "react"
import { CheckIcon, XIcon, ClockIcon, UserIcon, CalendarIcon, DollarSignIcon, PackageIcon, TrendingUpIcon } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Purchase {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  quantity: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  notes?: string
  rejectionReason?: string
  approvalNotes?: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  designation?: string
  billingName: string
  billingAddressLine1: string
  billingAddressLine2?: string
  billingCity: string
  billingState?: string
  billingCountry: string
  billingZipCode: string
  customer: {
    id: string
    name?: string
    email: string
    phone?: string
  }
  event: {
    id: string
    title: string
    eventDate: string
    organization?: {
      name: string
    }
  }
  ticketType: {
    id: string
    name: string
    price: number
    description?: string
  }
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectNotes, setRejectNotes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases')
        if (!response.ok) {
          throw new Error('Failed to fetch purchases')
        }
        const data = await response.json()
        setPurchases(data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
        toast.error('Failed to load purchases')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const handleApprove = async (purchaseId: string) => {
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/approve`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to approve purchase')
      }

      toast.success('Purchase approved successfully!')
      
      // Update local state
      setPurchases(purchases.map(p => 
        p.id === purchaseId ? { ...p, status: 'APPROVED' as const } : p
      ))
    } catch (error) {
      console.error('Error approving purchase:', error)
      toast.error('Failed to approve purchase')
    }
  }

  const handleReject = async (purchaseId: string) => {
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: rejectNotes[purchaseId] || 'Purchase request rejected'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject purchase')
      }

      toast.success('Purchase rejected')
      
      // Update local state
      setPurchases(purchases.map(p => 
        p.id === purchaseId ? { ...p, status: 'REJECTED' as const } : p
      ))
      
      // Clear reject notes
      setRejectNotes(prev => ({ ...prev, [purchaseId]: '' }))
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      toast.error('Failed to reject purchase')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
            <CheckIcon className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
            <XIcon className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const pendingPurchases = purchases.filter(p => p.status === 'PENDING')
  const processedPurchases = purchases.filter(p => p.status !== 'PENDING')

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Purchase Management
        </h1>
        <p className="text-muted-foreground text-lg mt-1">
          Review and approve ticket purchase requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPurchases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.filter(p => p.status === 'APPROVED').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${purchases.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + Number(p.totalAmount), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Purchases */}
      {pendingPurchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>
              Purchase requests awaiting your review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{purchase.event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(purchase.event.eventDate), "PPP")}
                      </p>
                    </div>
                    {getStatusBadge(purchase.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{purchase.customer.name || 'No name provided'}</div>
                          <div className="text-muted-foreground">{purchase.customer.email}</div>
                          {purchase.customer.phone && (
                            <div className="text-muted-foreground">{purchase.customer.phone}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="font-medium">{purchase.ticketType.name}</div>
                        <div className="text-muted-foreground">
                          ${Number(purchase.ticketType.price)} × {purchase.quantity} = ${Number(purchase.totalAmount).toFixed(2)}
                        </div>
                        <div className="text-muted-foreground">
                          Submitted: {format(new Date(purchase.createdAt), "PPP 'at' p")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleApprove(purchase.id)}
                      className="flex-1"
                    >
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Rejection reason (optional)"
                        value={rejectNotes[purchase.id] || ''}
                        onChange={(e) => setRejectNotes(prev => ({ ...prev, [purchase.id]: e.target.value }))}
                        rows={2}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(purchase.id)}
                        className="w-full"
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Processed Purchases */}
      {processedPurchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Purchases</CardTitle>
            <CardDescription>
              Previously approved or rejected purchases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {processedPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{purchase.event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(purchase.event.eventDate), "PPP")}
                      </p>
                    </div>
                    {getStatusBadge(purchase.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Customer</div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.customer.name || 'No name provided'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.customer.email}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Order Details</div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.ticketType.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {purchase.quantity} × ${Number(purchase.ticketType.price).toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Total</div>
                      <div className="text-sm font-semibold">${Number(purchase.totalAmount).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(purchase.createdAt), "PPP")}
                      </div>
                    </div>
                  </div>

                  {purchase.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium">Notes</div>
                      <div className="text-sm text-muted-foreground">{purchase.notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {purchases.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground text-center">
              Purchase requests will appear here once customers start buying tickets
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

