"use client"

import { useMemo } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import type { Order } from "@/lib/types"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface SalesChartProps {
  orders: Order[]
  detailed?: boolean
}

export function SalesChart({ orders, detailed = false }: SalesChartProps) {
  const chartData = useMemo(() => {
    // Get the last 6 months
    const today = new Date()
    const months = []
    const labels = []

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push(month)
      labels.push(month.toLocaleString("default", { month: "short" }))
    }

    // Calculate sales for each month
    const monthlySales = months.map((month) => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

      return orders.reduce((total, order) => {
        const orderDate = new Date(order.orderDate)
        if (orderDate >= monthStart && orderDate <= monthEnd) {
          return total + order.totalAmount
        }
        return total
      }, 0)
    })

    // For detailed view, add product breakdown
    let productData = []

    if (detailed) {
      // Get unique product IDs from orders
      const productIds = [...new Set(orders.flatMap((order) => order.items.map((item) => item.recipeId)))]

      // Calculate monthly sales for each product
      productData = productIds.map((productId) => {
        const monthlySalesByProduct = months.map((month) => {
          const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
          const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

          return orders.reduce((total, order) => {
            const orderDate = new Date(order.orderDate)
            if (orderDate >= monthStart && orderDate <= monthEnd) {
              const productItems = order.items.filter((item) => item.recipeId === productId)
              return total + productItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
            }
            return total
          }, 0)
        })

        return {
          productId,
          sales: monthlySalesByProduct,
        }
      })
    }

    return {
      labels,
      monthlySales,
      productData,
    }
  }, [orders, detailed])

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value,
        },
      },
    },
  }

  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Total Sales",
        data: chartData.monthlySales,
        borderColor: "#c2410c",
        backgroundColor: "rgba(194, 65, 12, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Total Sales",
        data: chartData.monthlySales,
        backgroundColor: "rgba(194, 65, 12, 0.7)",
      },
    ],
  }

  if (detailed && chartData.productData.length > 0) {
    // Add product-specific datasets for detailed view
    const colors = [
      "rgba(194, 65, 12, 0.7)", // amber
      "rgba(180, 83, 9, 0.7)", // amber darker
      "rgba(217, 119, 6, 0.7)", // amber lighter
      "rgba(146, 64, 14, 0.7)',   83,9,0.7)", // amber darker
      "rgba(217,119,6,0.7)", // amber lighter
      "rgba(146,64,14,0.7)", // amber dark
      "rgba(234,88,12,0.7)", // amber medium
    ]

    chartData.productData.forEach((product, index) => {
      barData.datasets.push({
        label: `Product ${index + 1}`,
        data: product.sales,
        backgroundColor: colors[index % colors.length],
      })
    })
  }

  return (
    <div className="h-[300px] w-full">
      {detailed ? <Bar options={options} data={barData} /> : <Line options={options} data={lineData} />}
    </div>
  )
}
