"use client"

import type { Dish } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CheckCircle2, XCircle, Leaf, Utensils, Flame, Apple } from "lucide-react"

interface DishDetailProps {
  dish: Dish
  onClose: () => void
  onAddToSelection: (dish: Dish) => void
}

export default function DishDetail({ dish, onClose, onAddToSelection }: DishDetailProps) {
  const getCarbonScoreClass = (score: "Low" | "Medium" | "High") => {
    switch (score) {
      case "Low":
        return "carbon-low"
      case "Medium":
        return "carbon-medium"
      case "High":
        return "carbon-high"
      default:
        return ""
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {dish.name}
            <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore} Carbon</Badge>
          </DialogTitle>
          <DialogDescription>{dish.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="relative h-64 w-full overflow-hidden rounded-xl">
            <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {dish.ethnoTag.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
              <Leaf className="h-5 w-5 text-primary mb-2" />
              <h3 className="text-sm font-medium mb-1">Carbon Footprint</h3>
              <p className="text-lg font-semibold">{dish.carbonFootprint} kg CO2e</p>
            </div>
            <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center">
              <Utensils className="h-5 w-5 text-secondary mb-2" />
              <h3 className="text-sm font-medium mb-1">Price</h3>
              <p className="text-lg font-semibold">
                {dish.currency}
                {dish.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Calories</p>
                <p className="font-medium">{dish.nutrition.calories}</p>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="font-medium">{dish.nutrition.protein}g</p>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="font-medium">{dish.nutrition.carbs}g</p>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="font-medium">{dish.nutrition.fat}g</p>
              </div>
              <div className="bg-muted p-2 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Fiber</p>
                <p className="font-medium">{dish.nutrition.fiber}g</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Apple className="h-4 w-4 text-primary" />
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-1">
              {dish.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5 text-xs">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Dietary Information</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1">
                {dish.isVegetarian ? (
                  <CheckCircle2 className="h-4 w-4 text-carbon-low" />
                ) : (
                  <XCircle className="h-4 w-4 text-carbon-high" />
                )}
                <span className="text-sm">Vegetarian</span>
              </div>
              <div className="flex items-center gap-1">
                {dish.isVegan ? (
                  <CheckCircle2 className="h-4 w-4 text-carbon-low" />
                ) : (
                  <XCircle className="h-4 w-4 text-carbon-high" />
                )}
                <span className="text-sm">Vegan</span>
              </div>
              <div className="flex items-center gap-1">
                {dish.isGlutenFree ? (
                  <CheckCircle2 className="h-4 w-4 text-carbon-low" />
                ) : (
                  <XCircle className="h-4 w-4 text-carbon-high" />
                )}
                <span className="text-sm">Gluten-Free</span>
              </div>
            </div>
          </div>

          {dish.allergens.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Allergens</h3>
              <div className="flex flex-wrap gap-1">
                {dish.allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onAddToSelection(dish)
              onClose()
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Add to Meal Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
