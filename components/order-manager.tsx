"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Order, OrderStatus, Product } from "@/lib/types"

interface OrderManagerProps {
  orders: Order[]
  products: Product[]
  onAddOrder: (order: Order) => void
  onUpdateOrder: (order: Order) => void
  onDeleteOrder: (id: string) => void
}

export default function OrderManager({
  orders,
  products,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
}: OrderManagerProps) {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    customerName: "",
    customerPhone: "",
    items: [],
    status: "pending",
    orderDate: format(new Date(), "yyyy-MM-dd"),
    deliveryDate: "",
    totalAmount: 0,
    notes: "",
  })
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [newItemProductId, setNewItemProductId] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [newItemPrice, setNewItemPrice] = useState(0)

  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const handleAddOrder = () => {
    if (!newOrder.customerName || !newOrder.customerPhone || !newOrder.deliveryDate || newOrder.items?.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one item",
        variant: "destructive",
      })
      return
    }

    const order: Order = {
      id: Date.now().toString(),
      customerName: newOrder.customerName || "",
      customerPhone: newOrder.customerPhone || "",
      items: newOrder.items || [],
      status: (newOrder.status as OrderStatus) || "pending",
      orderDate: newOrder.orderDate || format(new Date(), "yyyy-MM-dd"),
      deliveryDate: newOrder.deliveryDate || "",
      totalAmount: calculateTotal(newOrder.items || []),
      notes: newOrder.notes,
    }

    onAddOrder(order)
    setNewOrder({
      customerName: "",
      customerPhone: "",
      items: [],
      status: "pending",
      orderDate: format(new Date(), "yyyy-MM-dd"),
      deliveryDate: "",
      totalAmount: 0,
      notes: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Order Created",
      description: `Order for ${order.customerName} has been created successfully`,
    })
  }

  const handleEditOrder = () => {
    if (editingOrder) {
      if (
        !editingOrder.customerName ||
        !editingOrder.customerPhone ||
        !editingOrder.deliveryDate ||
        editingOrder.items.length === 0
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields and add at least one item",
          variant: "destructive",
        })
        return
      }

      const updatedOrder = {
        ...editingOrder,
        totalAmount: calculateTotal(editingOrder.items),
      }

      onUpdateOrder(updatedOrder)
      setEditingOrder(null)
      setIsEditDialogOpen(false)

      toast({
        title: "Order Updated",
        description: `Order for ${updatedOrder.customerName} has been updated successfully`,
      })
    }
  }

  const startEditing = (order: Order) => {
    setEditingOrder({ ...order })
    setIsEditDialogOpen(true)
  }

  const handleDeleteOrder = (id: string) => {
    onDeleteOrder(id)
    toast({
      title: "Order Deleted",
      description: "The order has been deleted successfully",
    })
  }

  const addItemToNewOrder = () => {
    if (!newItemProductId || newItemQuantity <= 0 || newItemPrice <= 0) {
      toast({
        title: "Error",
        description: "Please select a product, quantity, and price",
        variant: "destructive",
      })
      return
    }

    const items = [...(newOrder.items || [])]
    items.push({
      productId: newItemProductId,
      quantity: newItemQuantity,
      unitPrice: newItemPrice,
    })

    setNewOrder({
      ...newOrder,
      items,
      totalAmount: calculateTotal(items),
    })

    setNewItemProductId("")
    setNewItemQuantity(1)
    setNewItemPrice(0)
  }

  const addItemToEditingOrder = () => {
    if (!editingOrder || !newItemProductId || newItemQuantity <= 0 || newItemPrice <= 0) {
      toast({
        title: "Error",
        description: "Please select a product, quantity, and price",
        variant: "destructive",
      })
      return
    }

    const items = [...editingOrder.items]
    items.push({
      productId: newItemProductId,
      quantity: newItemQuantity,
      unitPrice: newItemPrice,
    })

    setEditingOrder({
      ...editingOrder,
      items,
      totalAmount: calculateTotal(items),
    })

    setNewItemProductId("")
    setNewItemQuantity(1)
    setNewItemPrice(0)
  }

  const removeItemFromNewOrder = (index: number) => {
    const items = [...(newOrder.items || [])]
    items.splice(index, 1)
    setNewOrder({
      ...newOrder,
      items,
      totalAmount: calculateTotal(items),
    })
  }

  const removeItemFromEditingOrder = (index: number) => {
    if (!editingOrder) return

    const items = [...editingOrder.items]
    items.splice(index, 1)
    setEditingOrder({
      ...editingOrder,
      items,
      totalAmount: calculateTotal(items),
    })
  }

  const calculateTotal = (items: { quantity: number; unitPrice: number }[]) => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  const getProductName = (id: string) => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : "Unknown Product"
  }

  const handleProductSelect = (productId: string) => {
    setNewItemProductId(productId)
    // Find the product to get the price
    const product = products.find((p) => p.id === productId)
    if (product) {
      setNewItemPrice(product.price)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage your customer orders</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="mr-2 h-4 w-4" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Enter the details for the new customer order</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name*</Label>
                    <Input
                      id="customerName"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number*</Label>
                    <Input
                      id="customerPhone"
                      value={newOrder.customerPhone}
                      onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order Date</Label>
                    <Input value={newOrder.orderDate} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {newOrder.deliveryDate ? (
                            format(new Date(newOrder.deliveryDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newOrder.deliveryDate ? new Date(newOrder.deliveryDate) : undefined}
                          onSelect={(date) =>
                            setNewOrder({
                              ...newOrder,
                              deliveryDate: date ? format(date, "yyyy-MM-dd") : "",
                            })
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newOrder.status}
                    onValueChange={(value) => setNewOrder({ ...newOrder, status: value as OrderStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    placeholder="Additional information about the order"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4">
                      <Label htmlFor="product">Product</Label>
                      <Select value={newItemProductId} onValueChange={handleProductSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="price">Unit Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addItemToNewOrder}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {newOrder.items && newOrder.items.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{getProductName(item.productId)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => removeItemFromNewOrder(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total:
                          </TableCell>
                          <TableCell className="font-bold">
                            ${calculateTotal(newOrder.items || []).toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddOrder}>
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{format(new Date(order.orderDate), "MMM d, yyyy")}</TableCell>
                <TableCell>{format(new Date(order.deliveryDate), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => startEditing(order)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>Update the details of the order</DialogDescription>
            </DialogHeader>
            {editingOrder && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-customerName">Customer Name*</Label>
                    <Input
                      id="edit-customerName"
                      value={editingOrder.customerName}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-customerPhone">Phone Number*</Label>
                    <Input
                      id="edit-customerPhone"
                      value={editingOrder.customerPhone}
                      onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order Date</Label>
                    <Input value={editingOrder.orderDate} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {editingOrder.deliveryDate ? (
                            format(new Date(editingOrder.deliveryDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editingOrder.deliveryDate ? new Date(editingOrder.deliveryDate) : undefined}
                          onSelect={(date) =>
                            setEditingOrder({
                              ...editingOrder,
                              deliveryDate: date ? format(date, "yyyy-MM-dd") : "",
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingOrder.status}
                    onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value as OrderStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editingOrder.notes || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                    placeholder="Additional information about the order"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4">
                      <Label htmlFor="edit-product">Product</Label>
                      <Select value={newItemProductId} onValueChange={handleProductSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="edit-quantity">Quantity</Label>
                      <Input
                        id="edit-quantity"
                        type="number"
                        min="1"
                        value={newItemQuantity}
                        onChange={(e) => setNewItemQuantity(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="edit-price">Unit Price</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addItemToEditingOrder}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {editingOrder.items.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editingOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{getProductName(item.productId)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => removeItemFromEditingOrder(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total:
                          </TableCell>
                          <TableCell className="font-bold">${calculateTotal(editingOrder.items).toFixed(2)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleEditOrder}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
