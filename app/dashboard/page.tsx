"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useSearchParams } from "next/navigation"
import IngredientManager from "@/components/ingredient-manager"
import RecipeManager from "@/components/recipe-manager"
import ProductManager from "@/components/product-manager"
import OrderManager from "@/components/order-manager"
import SupplierManager from "@/components/supplier-manager"
import ProductionPlanner from "@/components/production-planner"
import { SalesChart } from "@/components/sales-chart"
import { RecentSales } from "@/components/recent-sales"
import { PopularProducts } from "@/components/popular-products"
import { OverviewStats } from "@/components/overview-stats"
import type { Ingredient, Recipe, Order, Product, Supplier } from "@/lib/types"

export default function Dashboard() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const activeTab = tabParam || "overview"

  // Estado e funções existentes...
  // [Mantenha todo o código existente para estados e manipuladores]
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Distribuidora ABC",
      contactName: "João Silva",
      phone: "(11) 98765-4321",
      email: "contato@abc.com",
      address: "Rua Exemplo, 123",
    },
    {
      id: "2",
      name: "Atacadista XYZ",
      contactName: "Maria Oliveira",
      phone: "(11) 91234-5678",
      email: "vendas@xyz.com",
      address: "Av. Exemplo, 456",
    },
    {
      id: "3",
      name: "Importadora Global",
      contactName: "Carlos Santos",
      phone: "(11) 99876-5432",
      email: "global@email.com",
      address: "Rua Comercial, 789",
    },
  ])

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Farinha", unit: "kg", costPerUnit: 2.5, stock: 10, supplierId: "1" },
    { id: "2", name: "Açúcar", unit: "kg", costPerUnit: 3.0, stock: 8, supplierId: "1" },
    { id: "3", name: "Chocolate", unit: "kg", costPerUnit: 15.0, stock: 5, supplierId: "2" },
    { id: "4", name: "Manteiga", unit: "kg", costPerUnit: 12.0, stock: 4, supplierId: "3" },
    { id: "5", name: "Ovos", unit: "unidade", costPerUnit: 0.5, stock: 60, supplierId: "3" },
  ])

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "Mini Cake Base",
      ingredients: [
        { ingredientId: "1", quantity: 0.25 },
        { ingredientId: "2", quantity: 0.2 },
        { ingredientId: "3", quantity: 0.1 },
        { ingredientId: "4", quantity: 0.15 },
        { ingredientId: "5", quantity: 3 },
      ],
      yield: 4,
      laborCost: 10,
      overheadCost: 5,
    },
    {
      id: "2",
      name: "Cone Base",
      ingredients: [
        { ingredientId: "1", quantity: 0.1 },
        { ingredientId: "2", quantity: 0.05 },
      ],
      yield: 8,
      laborCost: 3,
      overheadCost: 1,
    },
    {
      id: "3",
      name: "Chocolate Stuffing",
      ingredients: [
        { ingredientId: "3", quantity: 0.15 },
        { ingredientId: "4", quantity: 0.05 },
      ],
      yield: 8,
      laborCost: 5,
      overheadCost: 2,
    },
    {
      id: "4",
      name: "Coxinha Dough",
      ingredients: [
        { ingredientId: "1", quantity: 0.3 },
        { ingredientId: "4", quantity: 0.1 },
        { ingredientId: "5", quantity: 2 },
      ],
      yield: 10,
      laborCost: 15,
      overheadCost: 5,
    },
    {
      id: "5",
      name: "Brownie Base",
      ingredients: [
        { ingredientId: "1", quantity: 0.2 },
        { ingredientId: "2", quantity: 0.25 },
        { ingredientId: "3", quantity: 0.3 },
        { ingredientId: "4", quantity: 0.2 },
        { ingredientId: "5", quantity: 4 },
      ],
      yield: 12,
      laborCost: 12,
      overheadCost: 6,
    },
  ])

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Mini Cake",
      description: "Delicious mini chocolate cake with rich flavor",
      components: [{ recipeId: "1", name: "Cake Base" }],
      price: 15.99,
    },
    {
      id: "2",
      name: "Truffled Cone",
      description: "Crispy cone filled with chocolate truffle",
      components: [
        { recipeId: "2", name: "Cone Base" },
        { recipeId: "3", name: "Chocolate Stuffing" },
      ],
      price: 12.5,
    },
    {
      id: "3",
      name: "Coxinha",
      description: "Traditional Brazilian snack with a crispy exterior",
      components: [{ recipeId: "4", name: "Dough" }],
      price: 5.99,
    },
    {
      id: "4",
      name: "Brownie",
      description: "Rich chocolate brownie with a fudgy center",
      components: [{ recipeId: "5", name: "Brownie Base" }],
      price: 8.99,
    },
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "Maria Silva",
      customerPhone: "(11) 98765-4321",
      items: [
        { productId: "1", quantity: 2, unitPrice: 15.99 },
        { productId: "4", quantity: 6, unitPrice: 8.99 },
      ],
      status: "completed",
      orderDate: "2023-05-10",
      deliveryDate: "2023-05-12",
      totalAmount: 85.92,
      notes: "Birthday celebration",
    },
    {
      id: "2",
      customerName: "João Oliveira",
      customerPhone: "(11) 91234-5678",
      items: [
        { productId: "2", quantity: 10, unitPrice: 12.5 },
        { productId: "3", quantity: 15, unitPrice: 5.99 },
      ],
      status: "pending",
      orderDate: "2023-05-15",
      deliveryDate: "2023-05-18",
      totalAmount: 214.85,
      notes: "Corporate event",
    },
    {
      id: "3",
      customerName: "Ana Pereira",
      customerPhone: "(11) 99876-5432",
      items: [
        { productId: "1", quantity: 5, unitPrice: 15.99 },
        { productId: "2", quantity: 8, unitPrice: 12.5 },
      ],
      status: "completed",
      orderDate: "2023-05-01",
      deliveryDate: "2023-05-03",
      totalAmount: 179.95,
      notes: "Family gathering",
    },
    {
      id: "4",
      customerName: "Carlos Santos",
      customerPhone: "(11) 98765-1234",
      items: [{ productId: "4", quantity: 12, unitPrice: 8.99 }],
      status: "completed",
      orderDate: "2023-05-05",
      deliveryDate: "2023-05-07",
      totalAmount: 107.88,
      notes: "Office party",
    },
    {
      id: "5",
      customerName: "Fernanda Lima",
      customerPhone: "(11) 91234-9876",
      items: [{ productId: "3", quantity: 20, unitPrice: 5.99 }],
      status: "processing",
      orderDate: "2023-05-18",
      deliveryDate: "2023-05-20",
      totalAmount: 119.8,
      notes: "School event",
    },
  ])

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient])
  }

  const handleUpdateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients(
      ingredients.map((ingredient) => (ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient)),
    )
  }

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
  }

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe])
  }

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    setRecipes(recipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)))
  }

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id))
  }

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product])
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleAddOrder = (order: Order) => {
    setOrders([...orders, order])
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
  }

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id))
  }

  // Funções para gerenciar fornecedores
  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers([...suppliers, supplier])
  }

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier)))
  }

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id))
  }

  // Calculate monthly sales
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlySales = orders.reduce((total, order) => {
    const orderDate = new Date(order.orderDate)
    if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
      return total + order.totalAmount
    }
    return total
  }, 0)

  // Calculate previous month sales for comparison
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const previousMonthlySales = orders.reduce((total, order) => {
    const orderDate = new Date(order.orderDate)
    if (orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousMonthYear) {
      return total + order.totalAmount
    }
    return total
  }, 0)

  // Calculate sales growth
  const salesGrowth =
    previousMonthlySales === 0 ? 100 : ((monthlySales - previousMonthlySales) / previousMonthlySales) * 100

  // Get recent sales (last 5 orders)
  const recentSales = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5)

  // Calculate popular products
  const productSales = products
    .map((product) => {
      const totalSold = orders.reduce((total, order) => {
        const orderItems = order.items.filter((item) => item.productId === product.id)
        return total + orderItems.reduce((sum, item) => sum + item.quantity, 0)
      }, 0)

      const totalRevenue = orders.reduce((total, order) => {
        const orderItems = order.items.filter((item) => item.productId === product.id)
        return total + orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      }, 0)

      return {
        id: product.id,
        name: product.name,
        totalSold,
        totalRevenue,
      }
    })
    .sort((a, b) => b.totalSold - a.totalSold)

  // Calculate total customers
  const totalCustomers = new Set(orders.map((order) => order.customerName)).size

  // Calculate total orders
  const totalOrders = orders.length

  // Renderizar o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R${monthlySales.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {salesGrowth >= 0 ? (
                      <span className="text-green-600 flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        {salesGrowth.toFixed(1)}% do mês passado
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <ArrowDown className="mr-1 h-4 w-4" />
                        {Math.abs(salesGrowth).toFixed(1)}% do mês passado
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {orders.filter((o) => o.status === "pending").length} pedidos pendentes
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      Novos clientes este mês
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mais Vendido</CardTitle>
                  <TrendingUp className="h-4 w-4 text-amber-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productSales.length > 0 ? productSales[0].name : "N/A"}</div>
                  <p className="text-xs text-muted-foreground">
                    {productSales.length > 0 ? `${productSales[0].totalSold} unidades vendidas` : "Sem dados de vendas"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Visão Geral de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <SalesChart orders={orders} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Vendas Recentes</CardTitle>
                  <CardDescription>Você fez {recentSales.length} vendas neste período</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales sales={recentSales} products={products} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Produtos Populares</CardTitle>
                  <CardDescription>Seus produtos mais vendidos este mês</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <PopularProducts products={productSales.slice(0, 5)} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Estatísticas Gerais</CardTitle>
                  <CardDescription>Indicadores-chave de desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <OverviewStats
                    totalRevenue={monthlySales}
                    totalOrders={totalOrders}
                    totalCustomers={totalCustomers}
                    pendingOrders={orders.filter((o) => o.status === "pending").length}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )
      case "analytics":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Análises de Vendas</CardTitle>
              <CardDescription>Análise detalhada do desempenho do seu negócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tendências de Vendas</h3>
                  <div className="h-[350px]">
                    <SalesChart orders={orders} detailed />
                  </div>
                </div>

                {/* Resto do conteúdo de análises... */}
                {/* Mantenha o conteúdo existente da aba analytics */}
              </div>
            </CardContent>
          </Card>
        )
      case "orders":
        return (
          <OrderManager
            orders={orders}
            products={products}
            onAddOrder={handleAddOrder}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        )
      case "products":
        return (
          <ProductManager
            products={products}
            recipes={recipes}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )
      case "recipes":
        return (
          <RecipeManager
            recipes={recipes}
            ingredients={ingredients}
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        )
      case "ingredients":
        return (
          <IngredientManager
            ingredients={ingredients}
            suppliers={suppliers}
            onAddIngredient={handleAddIngredient}
            onUpdateIngredient={handleUpdateIngredient}
            onDeleteIngredient={handleDeleteIngredient}
          />
        )
      case "suppliers":
        return (
          <SupplierManager
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onUpdateSupplier={handleUpdateSupplier}
            onDeleteSupplier={handleDeleteSupplier}
          />
        )
      case "production":
        return <ProductionPlanner orders={orders} products={products} />
      default:
        return null
    }
  }

  return <>{renderContent()}</>
}
