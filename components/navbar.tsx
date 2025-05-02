"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Menu, User, X, BarChart, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const isActive = (path: string) => {
    return pathname === path ? "text-amber-200" : "hover:text-amber-200"
  }

  return (
    <nav className="bg-amber-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold">
            Chokokon
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className={`flex items-center ${isActive("/dashboard")}`}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard?tab=analytics"
              className={`flex items-center ${isActive("/dashboard?tab=analytics")}`}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Link>
            <Link href="/dashboard?tab=orders" className={`flex items-center ${isActive("/dashboard?tab=orders")}`}>
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{user}</span>
            </div>
            <Button variant="ghost" className="text-white hover:text-amber-200" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-amber-800 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/dashboard" className="flex items-center py-2 hover:text-amber-200">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard?tab=analytics" className="flex items-center py-2 hover:text-amber-200">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Link>
            <Link href="/dashboard?tab=orders" className="flex items-center py-2 hover:text-amber-200">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Link>
            <div className="pt-2 border-t border-amber-700">
              <div className="flex items-center py-2">
                <User className="h-4 w-4 mr-2" />
                <span>{user}</span>
              </div>
              <Button
                className="w-full justify-start text-white hover:text-amber-200 p-0"
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
