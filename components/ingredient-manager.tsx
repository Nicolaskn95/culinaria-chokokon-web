"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Ingredient, Supplier } from "@/lib/types"

interface IngredientManagerProps {
  ingredients: Ingredient[]
  suppliers: Supplier[]
  onAddIngredient: (ingredient: Ingredient) => void
  onUpdateIngredient: (ingredient: Ingredient) => void
  onDeleteIngredient: (id: string) => void
}

export default function IngredientManager({
  ingredients,
  suppliers,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
}: IngredientManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    id: "",
    name: "",
    unit: "",
    costPerUnit: 0,
    stock: 0,
    supplierId: "",
  })
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(ingredients.length / itemsPerPage)

  // Obter ingredientes da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return ingredients.slice(startIndex, endIndex)
  }

  const handleAddIngredient = () => {
    const ingredient = {
      ...newIngredient,
      id: Date.now().toString(),
    }
    onAddIngredient(ingredient)
    setNewIngredient({
      id: "",
      name: "",
      unit: "",
      costPerUnit: 0,
      stock: 0,
      supplierId: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditIngredient = () => {
    if (editingIngredient) {
      onUpdateIngredient(editingIngredient)
      setEditingIngredient(null)
      setIsEditDialogOpen(false)
    }
  }

  const startEditing = (ingredient: Ingredient) => {
    setEditingIngredient({ ...ingredient })
    setIsEditDialogOpen(true)
  }

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return "Não especificado"
    const supplier = suppliers.find((s) => s.id === supplierId)
    return supplier ? supplier.name : "Não especificado"
  }

  // Gerar números de página para exibição
  const generatePaginationItems = () => {
    const items = []

    // Sempre mostrar a primeira página
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Adicionar elipses se necessário
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Já adicionamos a primeira e última página separadamente
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Adicionar elipses se necessário
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ingredientes</CardTitle>
            <CardDescription>Gerencie seus ingredientes e seus custos</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Ingrediente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Ingrediente</DialogTitle>
                <DialogDescription>Insira os detalhes do novo ingrediente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unidade
                  </Label>
                  <Input
                    id="unit"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="col-span-3"
                    placeholder="kg, g, unidade, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">
                    Custo por Unidade
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newIngredient.costPerUnit}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, costPerUnit: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Estoque
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newIngredient.stock}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, stock: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Fornecedor
                  </Label>
                  <Select
                    value={newIngredient.supplierId}
                    onValueChange={(value) => setNewIngredient({ ...newIngredient, supplierId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum fornecedor</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddIngredient}>
                  Adicionar Ingrediente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Custo por Unidade</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageItems().map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell>R${ingredient.costPerUnit.toFixed(2)}</TableCell>
                <TableCell>{ingredient.stock}</TableCell>
                <TableCell>{getSupplierName(ingredient.supplierId)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => startEditing(ingredient)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteIngredient(ingredient.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Ingrediente</DialogTitle>
              <DialogDescription>Atualize os detalhes do ingrediente</DialogDescription>
            </DialogHeader>
            {editingIngredient && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingIngredient.name}
                    onChange={(e) => setEditingIngredient({ ...editingIngredient, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-unit" className="text-right">
                    Unidade
                  </Label>
                  <Input
                    id="edit-unit"
                    value={editingIngredient.unit}
                    onChange={(e) => setEditingIngredient({ ...editingIngredient, unit: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cost" className="text-right">
                    Custo por Unidade
                  </Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={editingIngredient.costPerUnit}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        costPerUnit: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stock" className="text-right">
                    Estoque
                  </Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingIngredient.stock}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        stock: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-supplier" className="text-right">
                    Fornecedor
                  </Label>
                  <Select
                    value={editingIngredient.supplierId || ""}
                    onValueChange={(value) => setEditingIngredient({ ...editingIngredient, supplierId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum fornecedor</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleEditIngredient}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
