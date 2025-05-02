"use client"
import { ArrowUpRight, DollarSign, Package, Users, Clock } from "lucide-react"

interface OverviewStatsProps {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
}

export function OverviewStats({ totalRevenue, totalOrders, totalCustomers, pendingOrders }: OverviewStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-amber-100">
          <DollarSign className="h-4 w-4 text-amber-700" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="ml-auto font-medium text-green-600">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center">
        <div className="p-2 rounded-full bg-amber-100">
          <Package className="h-4 w-4 text-amber-700" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="p-2 rounded-full bg-amber-100">
          <Users className="h-4 w-4 text-amber-700" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Total Customers</p>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="p-2 rounded-full bg-amber-100">
          <Clock className="h-4 w-4 text-amber-700" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pending Orders</p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
      </div>
    </div>
  )
}
