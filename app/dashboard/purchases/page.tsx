"use client"

import { useState, useEffect } from "react"
import { CheckIcon, XIcon, ClockIcon, UserIcon, CalendarIcon, DollarSignIcon, EyeIcon, MoreHorizontalIcon, MailIcon, PhoneIcon, BuildingIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

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
      
      setPurchases(purchases.map(p => 
        p.id === purchaseId ? { ...p, status: 'APPROVED' as const } : p
      ))
      
      if (selectedPurchase?.id === purchaseId) {
        setSelectedPurchase({ ...selectedPurchase, status: 'APPROVED' as const })
      }
    } catch (error) {
      console.error('Error approving purchase:', error)
      toast.error('Failed to approve purchase')
    }
  }

  const handleReject = async (purchaseId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const response = await fetch(`/api/purchases/${purchaseId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: rejectionReason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject purchase')
      }

      toast.success('Purchase rejected')
      
      setPurchases(purchases.map(p => 
        p.id === purchaseId ? { ...p, status: 'REJECTED' as const, rejectionReason } : p
      ))
      
      if (selectedPurchase?.id === purchaseId) {
        setSelectedPurchase({ ...selectedPurchase, status: 'REJECTED' as const, rejectionReason })
      }
      
      setRejectionReason("")
      setDetailsOpen(false)
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      toast.error('Failed to reject purchase')
    }
  }

  const openDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setRejectionReason("")
    setDetailsOpen(true)
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
  const approvedPurchases = purchases.filter(p => p.status === 'APPROVED')
  const rejectedPurchases = purchases.filter(p => p.status === 'REJECTED')

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Purchase Management
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Review and approve ticket purchase requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <ClockIcon className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingPurchases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{approvedPurchases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${approvedPurchases.reduce((sum, p) => sum + Number(p.totalAmount), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground text-center">
              Purchase requests will appear here once customers start buying tickets
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingPurchases.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedPurchases.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedPurchases.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {pendingPurchases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending purchases</h3>
                  <p className="text-muted-foreground text-center">
                    All purchases have been processed
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPurchases.map((purchase) => (
                        <TableRow key={purchase.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(purchase)}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{purchase.customer.name || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">{purchase.customer.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium truncate max-w-[200px]">{purchase.event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(purchase.event.eventDate), "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>{purchase.ticketType.name}</TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button size="sm" onClick={() => handleApprove(purchase.id)}>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => openDetails(purchase)}>
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {pendingPurchases.map((purchase) => (
                    <Card key={purchase.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(purchase)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{purchase.event.title}</h3>
                            <p className="text-sm text-muted-foreground">{purchase.ticketType.name}</p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{purchase.customer.name || purchase.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</span>
                            <span className="text-muted-foreground">({purchase.quantity} tickets)</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            {format(new Date(purchase.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={(e) => {
                            e.stopPropagation()
                            handleApprove(purchase.id)
                          }}>
                            <CheckIcon className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
                            e.stopPropagation()
                            openDetails(purchase)
                          }}>
                            <EyeIcon className="mr-1 h-3 w-3" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            {approvedPurchases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved purchases</h3>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedPurchases.map((purchase) => (
                        <TableRow key={purchase.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(purchase)}>
                          <TableCell>
                            <div className="font-medium">{purchase.customer.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{purchase.customer.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium truncate max-w-[200px]">{purchase.event.title}</div>
                          </TableCell>
                          <TableCell>{purchase.ticketType.name}</TableCell>
                          <TableCell>{purchase.quantity}</TableCell>
                          <TableCell className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {purchase.approvedAt ? format(new Date(purchase.approvedAt), "MMM d, yyyy") : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={(e) => {
                              e.stopPropagation()
                              openDetails(purchase)
                            }}>
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {approvedPurchases.map((purchase) => (
                    <Card key={purchase.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(purchase)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{purchase.event.title}</h3>
                            <p className="text-sm text-muted-foreground">{purchase.customer.name || purchase.customer.email}</p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{purchase.quantity} × {purchase.ticketType.name}</span>
                          <span className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected">
            {rejectedPurchases.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rejected purchases</h3>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedPurchases.map((purchase) => (
                        <TableRow key={purchase.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(purchase)}>
                          <TableCell>
                            <div className="font-medium">{purchase.customer.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{purchase.customer.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium truncate max-w-[200px]">{purchase.event.title}</div>
                          </TableCell>
                          <TableCell>{purchase.ticketType.name}</TableCell>
                          <TableCell className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {purchase.rejectionReason || 'No reason provided'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={(e) => {
                              e.stopPropagation()
                              openDetails(purchase)
                            }}>
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {rejectedPurchases.map((purchase) => (
                    <Card key={purchase.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(purchase)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{purchase.event.title}</h3>
                            <p className="text-sm text-muted-foreground">{purchase.customer.name || purchase.customer.email}</p>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                        {purchase.rejectionReason && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Reason: {purchase.rejectionReason}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{purchase.quantity} tickets</span>
                          <span className="font-medium">${Number(purchase.totalAmount).toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPurchase && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedPurchase.event.title}</DialogTitle>
                    <DialogDescription>
                      Purchase request from {selectedPurchase.customer.name || selectedPurchase.customer.email}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedPurchase.status)}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Customer Information</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedPurchase.firstName} {selectedPurchase.lastName}</p>
                        {selectedPurchase.designation && selectedPurchase.company && (
                          <p className="text-sm text-muted-foreground">{selectedPurchase.designation} at {selectedPurchase.company}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{selectedPurchase.email}</p>
                    </div>
                    {selectedPurchase.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedPurchase.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Order Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{selectedPurchase.ticketType.name}</p>
                        <p className="text-sm text-muted-foreground">${Number(selectedPurchase.ticketType.price).toFixed(2)} per ticket</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Quantity: {selectedPurchase.quantity}</p>
                        <p className="text-lg font-bold">${Number(selectedPurchase.totalAmount).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Billing Address</h4>
                  <div className="p-3 rounded-lg border text-sm space-y-1">
                    <p>{selectedPurchase.billingName}</p>
                    <p>{selectedPurchase.billingAddressLine1}</p>
                    {selectedPurchase.billingAddressLine2 && <p>{selectedPurchase.billingAddressLine2}</p>}
                    <p>
                      {selectedPurchase.billingCity}, {selectedPurchase.billingState} {selectedPurchase.billingZipCode}
                    </p>
                    <p>{selectedPurchase.billingCountry}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedPurchase.notes && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Customer Notes</h4>
                    <div className="p-3 rounded-lg bg-muted text-sm">
                      {selectedPurchase.notes}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedPurchase.status === 'REJECTED' && selectedPurchase.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Rejection Reason</h4>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
                      {selectedPurchase.rejectionReason}
                    </div>
                  </div>
                )}

                {/* Actions for Pending */}
                {selectedPurchase.status === 'PENDING' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          handleApprove(selectedPurchase.id)
                          setDetailsOpen(false)
                        }}
                      >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Approve Purchase
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Rejection Reason (Required)</Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Please provide a reason for rejecting this purchase request..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleReject(selectedPurchase.id)}
                        disabled={!rejectionReason.trim()}
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Reject Purchase
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
