"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product, Recipe } from "@/lib/types"

interface ProductManagerProps {
  products: Product[]
  recipes: Recipe[]
  onAddProduct: (product: Product) => void
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (id: string) => void
}

export default function ProductManager({
  products,
  recipes,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    components: [],
    price: 0,
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newComponentRecipeId, setNewComponentRecipeId] = useState<string>("")
  const [newComponentName, setNewComponentName] = useState<string>("")

  const handleAddProduct = () => {
    const product = {
      ...newProduct,
      id: Date.now().toString(),
    }
    onAddProduct(product)
    setNewProduct({
      id: "",
      name: "",
      description: "",
      components: [],
      price: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct)
      setEditingProduct(null)
      setIsEditDialogOpen(false)
    }
  }

  const startEditing = (product: Product) => {
    setEditingProduct({ ...product })
    setIsEditDialogOpen(true)
  }

  const addComponentToNewProduct = () => {
    if (newComponentRecipeId && newComponentName) {
      setNewProduct({
        ...newProduct,
        components: [
          ...newProduct.components,
          {
            recipeId: newComponentRecipeId,
            name: newComponentName,
          },
        ],
      })
      setNewComponentRecipeId("")
      setNewComponentName("")
    }
  }

  const addComponentToEditingProduct = () => {
    if (editingProduct && newComponentRecipeId && newComponentName) {
      setEditingProduct({
        ...editingProduct,
        components: [
          ...editingProduct.components,
          {
            recipeId: newComponentRecipeId,
            name: newComponentName,
          },
        ],
      })
      setNewComponentRecipeId("")
      setNewComponentName("")
    }
  }

  const removeComponentFromNewProduct = (index: number) => {
    setNewProduct({
      ...newProduct,
      components: newProduct.components.filter((_, i) => i !== index),
    })
  }

  const removeComponentFromEditingProduct = (index: number) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        components: editingProduct.components.filter((_, i) => i !== index),
      })
    }
  }

  const getRecipeName = (id: string) => {
    const recipe = recipes.find((r) => r.id === id)
    return recipe ? recipe.name : "Receita Desconhecida"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerencie seus produtos e seus componentes de receita</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>Insira os detalhes do novo produto</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome do Produto
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Preço
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Componentes do Produto</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-5">
                      <Label htmlFor="recipe">Receita</Label>
                      <Select value={newComponentRecipeId} onValueChange={setNewComponentRecipeId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a receita" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipes.map((recipe) => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Label htmlFor="componentName">Nome do Componente</Label>
                      <Input
                        id="componentName"
                        value={newComponentName}
                        onChange={(e) => setNewComponentName(e.target.value)}
                        placeholder="ex: Recheio, Cobertura, Base"
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addComponentToNewProduct}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {newProduct.components.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Componente</TableHead>
                          <TableHead>Receita</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newProduct.components.map((component, index) => (
                          <TableRow key={index}>
                            <TableCell>{component.name}</TableCell>
                            <TableCell>{getRecipeName(component.recipeId)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => removeComponentFromNewProduct(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddProduct}>
                  Adicionar Produto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {products.map((product) => (
            <AccordionItem key={product.id} value={product.id}>
              <AccordionTrigger className="hover:bg-amber-100 px-4 py-2 rounded-md">
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{product.name}</span>
                  <span className="text-sm text-muted-foreground">R${product.price.toFixed(2)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <h4 className="font-medium mb-2">Componentes:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Componente</TableHead>
                        <TableHead>Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.components.map((component, index) => (
                        <TableRow key={index}>
                          <TableCell>{component.name}</TableCell>
                          <TableCell>{getRecipeName(component.recipeId)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(product)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>Atualize os detalhes do produto</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nome do Produto
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Preço
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Componentes do Produto</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-5">
                      <Label htmlFor="edit-recipe">Receita</Label>
                      <Select value={newComponentRecipeId} onValueChange={setNewComponentRecipeId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a receita" />
                        </SelectTrigger>
                        <SelectContent>
                          {recipes.map((recipe) => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Label htmlFor="edit-componentName">Nome do Componente</Label>
                      <Input
                        id="edit-componentName"
                        value={newComponentName}
                        onChange={(e) => setNewComponentName(e.target.value)}
                        placeholder="ex: Recheio, Cobertura, Base"
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addComponentToEditingProduct}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {editingProduct.components.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Componente</TableHead>
                          <TableHead>Receita</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editingProduct.components.map((component, index) => (
                          <TableRow key={index}>
                            <TableCell>{component.name}</TableCell>
                            <TableCell>{getRecipeName(component.recipeId)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeComponentFromEditingProduct(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleEditProduct}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
