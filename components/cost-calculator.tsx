"use client"

import { useMemo } from "react"
import { Calculator } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ingredient, Recipe } from "@/lib/types"

interface CostCalculatorProps {
  recipes: Recipe[]
  ingredients: Ingredient[]
}

export default function CostCalculator({ recipes, ingredients }: CostCalculatorProps) {
  const productCosts = useMemo(() => {
    return recipes.map((recipe) => {
      // Calculate ingredient costs
      const ingredientCost = recipe.ingredients.reduce((total, recipeIngredient) => {
        const ingredient = ingredients.find((i) => i.id === recipeIngredient.ingredientId)
        if (ingredient) {
          return total + ingredient.costPerUnit * recipeIngredient.quantity
        }
        return total
      }, 0)

      // Calculate total cost
      const totalCost = ingredientCost + recipe.laborCost + recipe.overheadCost

      // Calculate unit cost
      const unitCost = totalCost / recipe.yield

      // Calculate suggested price (30% profit margin)
      const suggestedPrice = unitCost * 1.3

      return {
        recipeName: recipe.name,
        ingredientCost,
        laborCost: recipe.laborCost,
        overheadCost: recipe.overheadCost,
        totalCost,
        unitCost,
        suggestedPrice,
      }
    })
  }, [recipes, ingredients])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-amber-700" />
          <div>
            <CardTitle>Cost Calculator</CardTitle>
            <CardDescription>Calculate the unit price of your products</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Ingredient Cost</TableHead>
              <TableHead>Labor Cost</TableHead>
              <TableHead>Overhead Cost</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Suggested Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productCosts.map((cost, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{cost.recipeName}</TableCell>
                <TableCell>${cost.ingredientCost.toFixed(2)}</TableCell>
                <TableCell>${cost.laborCost.toFixed(2)}</TableCell>
                <TableCell>${cost.overheadCost.toFixed(2)}</TableCell>
                <TableCell>${cost.totalCost.toFixed(2)}</TableCell>
                <TableCell className="font-bold">${cost.unitCost.toFixed(2)}</TableCell>
                <TableCell className="text-green-600 font-bold">${cost.suggestedPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8 bg-amber-50 p-4 rounded-md border border-amber-200">
          <h3 className="text-lg font-medium mb-2 text-amber-900">How Costs Are Calculated</h3>
          <ul className="list-disc pl-5 space-y-2 text-amber-800">
            <li>
              <span className="font-medium">Ingredient Cost:</span> Sum of (ingredient quantity × cost per unit) for all
              ingredients in the recipe
            </li>
            <li>
              <span className="font-medium">Total Cost:</span> Ingredient Cost + Labor Cost + Overhead Cost
            </li>
            <li>
              <span className="font-medium">Unit Cost:</span> Total Cost ÷ Yield (number of units produced)
            </li>
            <li>
              <span className="font-medium">Suggested Price:</span> Unit Cost × 1.3 (30% profit margin)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
