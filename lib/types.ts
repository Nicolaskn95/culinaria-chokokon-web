export interface Ingredient {
  id: string
  name: string
  unit: string
  costPerUnit: number
  stock: number
  supplierId?: string // Adicionado campo de fornecedor
}

export interface RecipeIngredient {
  ingredientId: string
  quantity: number
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  yield: number
  laborCost: number
  overheadCost: number
}

export interface ProductComponent {
  recipeId: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  components: ProductComponent[]
  price: number
  image?: string
}

export interface ProductCost {
  productName: string
  ingredientCost: number
  laborCost: number
  overheadCost: number
  totalCost: number
  unitCost: number
  suggestedPrice: number
}

export interface OrderItem {
  productId: string
  quantity: number
  unitPrice: number
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  status: OrderStatus
  orderDate: string
  deliveryDate: string
  totalAmount: number
  notes?: string
}

// Nova interface para fornecedores
export interface Supplier {
  id: string
  name: string
  contactName: string
  phone: string
  email: string
  address?: string
  notes?: string
}
