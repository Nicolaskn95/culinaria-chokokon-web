"use client"

import { useMemo, useState } from "react"
import { ClipboardList, Calendar, ChevronRight, User, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Order, Product } from "@/lib/types"

interface ProductionPlannerProps {
  orders: Order[]
  products: Product[]
}

export default function ProductionPlanner({ orders, products }: ProductionPlannerProps) {
  // Estado para controlar o diálogo de detalhes dos pedidos
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Calcular a quantidade de cada produto necessária para pedidos pendentes e em processamento
  const productionNeeds = useMemo(() => {
    // Filtrar apenas pedidos pendentes e em processamento
    const relevantOrders = orders.filter((order) => order.status === "pending" || order.status === "processing")

    // Agrupar por data de entrega
    const ordersByDate: Record<string, Order[]> = {}
    relevantOrders.forEach((order) => {
      if (!ordersByDate[order.deliveryDate]) {
        ordersByDate[order.deliveryDate] = []
      }
      ordersByDate[order.deliveryDate].push(order)
    })

    // Calcular necessidades de produção por data
    const productionByDate = Object.keys(ordersByDate)
      .sort() // Ordenar datas
      .map((date) => {
        const dateOrders = ordersByDate[date]

        // Calcular quantidade de cada produto para esta data
        const productQuantities: Record<string, number> = {}

        dateOrders.forEach((order) => {
          order.items.forEach((item) => {
            if (!productQuantities[item.productId]) {
              productQuantities[item.productId] = 0
            }
            productQuantities[item.productId] += item.quantity
          })
        })

        // Converter para array de objetos
        const products = Object.keys(productQuantities).map((productId) => ({
          productId,
          quantity: productQuantities[productId],
        }))

        return {
          date,
          products,
          totalOrders: dateOrders.length,
          orders: dateOrders, // Armazenar os pedidos para esta data
        }
      })

    return productionByDate
  }, [orders])

  // Calcular o total geral de produtos necessários
  const totalProductionNeeds = useMemo(() => {
    const totals: Record<string, number> = {}

    productionNeeds.forEach((dayPlan) => {
      dayPlan.products.forEach((product) => {
        if (!totals[product.productId]) {
          totals[product.productId] = 0
        }
        totals[product.productId] += product.quantity
      })
    })

    return Object.keys(totals).map((productId) => ({
      productId,
      quantity: totals[productId],
    }))
  }, [productionNeeds])

  // Função para obter o nome do produto pelo ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Produto Desconhecido"
  }

  // Verificar se há pedidos pendentes
  const hasPendingOrders = productionNeeds.length > 0

  // Função para abrir o diálogo com os pedidos da data selecionada
  const handleViewOrders = (date: string) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  // Obter os pedidos para a data selecionada
  const selectedDateOrders = useMemo(() => {
    if (!selectedDate) return []
    const dayPlan = productionNeeds.find((plan) => plan.date === selectedDate)
    return dayPlan ? dayPlan.orders : []
  }, [selectedDate, productionNeeds])

  // Formatar status do pedido
  const formatOrderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "processing":
        return "Em Processamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Cores para os status dos pedidos
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-amber-700" />
          <div>
            <CardTitle>Planejamento de Produção</CardTitle>
            <CardDescription>Doces necessários para pedidos pendentes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasPendingOrders ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Não há pedidos pendentes ou em processamento no momento.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Resumo de Produção Total</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Quantidade Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalProductionNeeds.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{getProductName(item.productId)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-amber-50 text-amber-900">
                          {item.quantity} unidades
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Planejamento por Data de Entrega</h3>
              <div className="space-y-4">
                {productionNeeds.map((dayPlan) => (
                  <Card key={dayPlan.date} className="overflow-hidden">
                    <div className="bg-amber-100 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-700" />
                        <h4 className="font-medium">
                          {format(new Date(dayPlan.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </h4>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {dayPlan.totalOrders} {dayPlan.totalOrders === 1 ? "pedido" : "pedidos"}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Quantidade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dayPlan.products.map((product) => (
                            <TableRow key={product.productId}>
                              <TableCell>{getProductName(product.productId)}</TableCell>
                              <TableCell className="text-right">{product.quantity} unidades</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-700"
                          onClick={() => handleViewOrders(dayPlan.date)}
                        >
                          Ver Pedidos <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Diálogo para mostrar os detalhes dos pedidos */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Pedidos para{" "}
                {selectedDate && format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {selectedDateOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Pedido #{order.id}</div>
                      <Badge className={statusColors[order.status]}>{formatOrderStatus(order.status)}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      Data do pedido: {format(new Date(order.orderDate), "dd/MM/yyyy")}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Cliente:</span> {order.customerName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Telefone:</span> {order.customerPhone}
                        </div>
                      </div>
                      {order.notes && (
                        <div>
                          <span className="font-medium">Observações:</span>
                          <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Itens do Pedido</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-center">Quantidade</TableHead>
                            <TableHead className="text-right">Preço Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{getProductName(item.productId)}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-right">R$ {item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                R$ {(item.quantity * item.unitPrice).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-bold">
                              Total do Pedido:
                            </TableCell>
                            <TableCell className="text-right font-bold">R$ {order.totalAmount.toFixed(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
