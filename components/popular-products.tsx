"use client"

interface ProductSale {
  id: string
  name: string
  totalSold: number
  totalRevenue: number
}

interface PopularProductsProps {
  products: ProductSale[]
  showRevenue?: boolean
}

export function PopularProducts({ products, showRevenue = false }: PopularProductsProps) {
  const maxSold = Math.max(...products.map((p) => p.totalSold), 1)

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.id} className="flex items-center">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <div className="flex items-center pt-1">
              <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-700 rounded-full"
                  style={{ width: `${(product.totalSold / maxSold) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="ml-auto font-medium">
            {showRevenue ? `$${product.totalRevenue.toFixed(2)}` : `${product.totalSold} units`}
          </div>
        </div>
      ))}
    </div>
  )
}
