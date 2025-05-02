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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ingredient, Recipe, RecipeIngredient } from "@/lib/types"

interface RecipeManagerProps {
  recipes: Recipe[]
  ingredients: Ingredient[]
  onAddRecipe: (recipe: Recipe) => void
  onUpdateRecipe: (recipe: Recipe) => void
  onDeleteRecipe: (id: string) => void
}

export default function RecipeManager({
  recipes,
  ingredients,
  onAddRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
}: RecipeManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: "",
    name: "",
    ingredients: [],
    yield: 1,
    laborCost: 0,
    overheadCost: 0,
  })
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [newIngredientId, setNewIngredientId] = useState<string>("")
  const [newIngredientQuantity, setNewIngredientQuantity] = useState<number>(0)

  const handleAddRecipe = () => {
    const recipe = {
      ...newRecipe,
      id: Date.now().toString(),
    }
    onAddRecipe(recipe)
    setNewRecipe({
      id: "",
      name: "",
      ingredients: [],
      yield: 1,
      laborCost: 0,
      overheadCost: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditRecipe = () => {
    if (editingRecipe) {
      onUpdateRecipe(editingRecipe)
      setEditingRecipe(null)
      setIsEditDialogOpen(false)
    }
  }

  const startEditing = (recipe: Recipe) => {
    setEditingRecipe({ ...recipe })
    setIsEditDialogOpen(true)
  }

  const addIngredientToNewRecipe = () => {
    if (newIngredientId && newIngredientQuantity > 0) {
      setNewRecipe({
        ...newRecipe,
        ingredients: [
          ...newRecipe.ingredients,
          {
            ingredientId: newIngredientId,
            quantity: newIngredientQuantity,
          },
        ],
      })
      setNewIngredientId("")
      setNewIngredientQuantity(0)
    }
  }

  const addIngredientToEditingRecipe = () => {
    if (editingRecipe && newIngredientId && newIngredientQuantity > 0) {
      setEditingRecipe({
        ...editingRecipe,
        ingredients: [
          ...editingRecipe.ingredients,
          {
            ingredientId: newIngredientId,
            quantity: newIngredientQuantity,
          },
        ],
      })
      setNewIngredientId("")
      setNewIngredientQuantity(0)
    }
  }

  const removeIngredientFromNewRecipe = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((_, i) => i !== index),
    })
  }

  const removeIngredientFromEditingRecipe = (index: number) => {
    if (editingRecipe) {
      setEditingRecipe({
        ...editingRecipe,
        ingredients: editingRecipe.ingredients.filter((_, i) => i !== index),
      })
    }
  }

  const getIngredientName = (id: string) => {
    const ingredient = ingredients.find((i) => i.id === id)
    return ingredient ? ingredient.name : "Desconhecido"
  }

  const getIngredientUnit = (id: string) => {
    const ingredient = ingredients.find((i) => i.id === id)
    return ingredient ? ingredient.unit : ""
  }

  const calculateIngredientsCost = (recipeIngredients: RecipeIngredient[]) => {
    return recipeIngredients.reduce((total, recipeIngredient) => {
      const ingredient = ingredients.find((i) => i.id === recipeIngredient.ingredientId)
      if (ingredient) {
        return total + ingredient.costPerUnit * recipeIngredient.quantity
      }
      return total
    }, 0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Gerencie suas receitas e seus ingredientes</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Receita</DialogTitle>
                <DialogDescription>Insira os detalhes da nova receita</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome da Receita
                  </Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="yield" className="text-right">
                    Rendimento (unidades)
                  </Label>
                  <Input
                    id="yield"
                    type="number"
                    value={newRecipe.yield}
                    onChange={(e) => setNewRecipe({ ...newRecipe, yield: Number.parseInt(e.target.value) || 1 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="labor" className="text-right">
                    Custo de Mão de Obra
                  </Label>
                  <Input
                    id="labor"
                    type="number"
                    value={newRecipe.laborCost}
                    onChange={(e) => setNewRecipe({ ...newRecipe, laborCost: Number.parseFloat(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="overhead" className="text-right">
                    Custo Operacional
                  </Label>
                  <Input
                    id="overhead"
                    type="number"
                    value={newRecipe.overheadCost}
                    onChange={(e) =>
                      setNewRecipe({ ...newRecipe, overheadCost: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Ingredientes</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-5">
                      <Label htmlFor="ingredient">Ingrediente</Label>
                      <Select value={newIngredientId} onValueChange={setNewIngredientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ingrediente" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Label htmlFor="quantity">Quantidade</Label>
                      <div className="flex items-center">
                        <Input
                          id="quantity"
                          type="number"
                          value={newIngredientQuantity || ""}
                          onChange={(e) => setNewIngredientQuantity(Number.parseFloat(e.target.value) || 0)}
                        />
                        <span className="ml-2">{newIngredientId ? getIngredientUnit(newIngredientId) : ""}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addIngredientToNewRecipe}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {newRecipe.ingredients.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingrediente</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newRecipe.ingredients.map((ingredient, index) => (
                          <TableRow key={index}>
                            <TableCell>{getIngredientName(ingredient.ingredientId)}</TableCell>
                            <TableCell>
                              {ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => removeIngredientFromNewRecipe(index)}>
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
                <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleAddRecipe}>
                  Adicionar Receita
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {recipes.map((recipe) => (
            <AccordionItem key={recipe.id} value={recipe.id}>
              <AccordionTrigger className="hover:bg-amber-100 px-4 py-2 rounded-md">
                <div className="flex justify-between items-center w-full pr-4">
                  <span>{recipe.name}</span>
                  <span className="text-sm text-muted-foreground">Rendimento: {recipe.yield} unidades</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2">
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="font-medium">Custo de Mão de Obra:</span> R${recipe.laborCost.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Custo Operacional:</span> R${recipe.overheadCost.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Custo de Ingredientes:</span> R$
                      {calculateIngredientsCost(recipe.ingredients).toFixed(2)}
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="font-medium">Custo Total da Receita:</span> R$
                    {(recipe.laborCost + recipe.overheadCost + calculateIngredientsCost(recipe.ingredients)).toFixed(2)}
                  </div>
                  <h4 className="font-medium mb-2">Ingredientes:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipe.ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell>{getIngredientName(ingredient.ingredientId)}</TableCell>
                          <TableCell>
                            {ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEditing(recipe)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => onDeleteRecipe(recipe.id)}
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
              <DialogTitle>Editar Receita</DialogTitle>
              <DialogDescription>Atualize os detalhes da receita</DialogDescription>
            </DialogHeader>
            {editingRecipe && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nome da Receita
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingRecipe.name}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-yield" className="text-right">
                    Rendimento (unidades)
                  </Label>
                  <Input
                    id="edit-yield"
                    type="number"
                    value={editingRecipe.yield}
                    onChange={(e) =>
                      setEditingRecipe({ ...editingRecipe, yield: Number.parseInt(e.target.value) || 1 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-labor" className="text-right">
                    Custo de Mão de Obra
                  </Label>
                  <Input
                    id="edit-labor"
                    type="number"
                    value={editingRecipe.laborCost}
                    onChange={(e) =>
                      setEditingRecipe({ ...editingRecipe, laborCost: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-overhead" className="text-right">
                    Custo Operacional
                  </Label>
                  <Input
                    id="edit-overhead"
                    type="number"
                    value={editingRecipe.overheadCost}
                    onChange={(e) =>
                      setEditingRecipe({ ...editingRecipe, overheadCost: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Ingredientes</h3>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-5">
                      <Label htmlFor="edit-ingredient">Ingrediente</Label>
                      <Select value={newIngredientId} onValueChange={setNewIngredientId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ingrediente" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Label htmlFor="edit-quantity">Quantidade</Label>
                      <div className="flex items-center">
                        <Input
                          id="edit-quantity"
                          type="number"
                          value={newIngredientQuantity || ""}
                          onChange={(e) => setNewIngredientQuantity(Number.parseFloat(e.target.value) || 0)}
                        />
                        <span className="ml-2">{newIngredientId ? getIngredientUnit(newIngredientId) : ""}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        type="button"
                        className="w-full bg-amber-700 hover:bg-amber-800"
                        onClick={addIngredientToEditingRecipe}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {editingRecipe.ingredients.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingrediente</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editingRecipe.ingredients.map((ingredient, index) => (
                          <TableRow key={index}>
                            <TableCell>{getIngredientName(ingredient.ingredientId)}</TableCell>
                            <TableCell>
                              {ingredient.quantity} {getIngredientUnit(ingredient.ingredientId)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredientFromEditingRecipe(index)}
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
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleEditRecipe}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
