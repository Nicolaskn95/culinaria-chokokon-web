"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  BarChart,
  ClipboardList,
  Home,
  Package,
  ShoppingBag,
  Utensils,
  Warehouse,
  Truck,
  LogOut,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  // Determinar a aba ativa com base nos parâmetros de busca
  const activeTab = searchParams.get("tab") || "overview"

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso",
    })
    router.push("/login")
  }

  return (
    <Sidebar className="bg-white dark:bg-gray-900">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div className="font-bold text-lg">Chokokon</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "overview"}
              onClick={() => handleTabChange("overview")}
              tooltip="Visão Geral"
              className="text-gray-800 dark:text-gray-200"
            >
              <Home className="h-5 w-5" />
              <span>Visão Geral</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "analytics"}
              onClick={() => handleTabChange("analytics")}
              tooltip="Análises"
              className="text-gray-800 dark:text-gray-200"
            >
              <BarChart className="h-5 w-5" />
              <span>Análises</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "orders"}
              onClick={() => handleTabChange("orders")}
              tooltip="Pedidos"
              className="text-gray-800 dark:text-gray-200"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Pedidos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "products"}
              onClick={() => handleTabChange("products")}
              tooltip="Produtos"
              className="text-gray-800 dark:text-gray-200"
            >
              <Package className="h-5 w-5" />
              <span>Produtos</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "recipes"}
              onClick={() => handleTabChange("recipes")}
              tooltip="Receitas"
              className="text-gray-800 dark:text-gray-200"
            >
              <Utensils className="h-5 w-5" />
              <span>Receitas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "ingredients"}
              onClick={() => handleTabChange("ingredients")}
              tooltip="Ingredientes"
              className="text-gray-800 dark:text-gray-200"
            >
              <Warehouse className="h-5 w-5" />
              <span>Ingredientes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "suppliers"}
              onClick={() => handleTabChange("suppliers")}
              tooltip="Fornecedores"
              className="text-gray-800 dark:text-gray-200"
            >
              <Truck className="h-5 w-5" />
              <span>Fornecedores</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeTab === "production"}
              onClick={() => handleTabChange("production")}
              tooltip="Produção"
              className="text-gray-800 dark:text-gray-200"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Produção</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-2 px-2 py-1">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user}</span>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
