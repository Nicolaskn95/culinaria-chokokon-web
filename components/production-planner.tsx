"use client"

import { useMemo } from "react"
import { ClipboardList, Calendar, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Order, Product } from "@/lib/types"

interface ProductionPlannerProps {
  orders: Order[]
  products: Product[]
}

export default function ProductionPlanner({ orders, products }: ProductionPlannerProps) {
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
                        <Button variant="outline" size="sm" className="text-amber-700">
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
      </CardContent>
    </Card>
  )
}
