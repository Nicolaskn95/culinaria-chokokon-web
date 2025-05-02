"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Order, Product } from "@/lib/types"

interface RecentSalesProps {
  sales: Order[]
  products: Product[]
}

export function RecentSales({ sales, products }: RecentSalesProps) {
  const getProductName = (id: string) => {
    const product = products.find((p) => p.id === id)
    return product ? product.name : "Unknown Product"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9 bg-amber-700">
            <AvatarFallback>{getInitials(sale.customerName)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {sale.items.map((item) => getProductName(item.productId)).join(", ")}
            </p>
          </div>
          <div className="ml-auto font-medium">${sale.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
