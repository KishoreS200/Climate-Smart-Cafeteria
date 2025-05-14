"use client"

import CarbonNutritionChart from "@/components/carbon-nutrition-chart"
import DishDetail from "@/components/dish-detail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { type Dish, dishes } from "@/lib/data"
import { Check, DollarSign, Filter, Leaf, Search, Utensils } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function MealPlanner() {
  const { toast } = useToast()
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(dishes)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEthnoTags, setSelectedEthnoTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 300]) // Increased for Indian Rupee prices
  const [carbonFilter, setCarbonFilter] = useState<string[]>([])
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  })
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([])
  const [indianCuisineFilter, setIndianCuisineFilter] = useState(false)

  // Get unique ethno tags from all dishes
  const allEthnoTags = Array.from(new Set(dishes.flatMap((dish) => dish.ethnoTag))).sort()

  // Filter dishes based on search query and filters
  useEffect(() => {
    let result = [...dishes]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query) ||
          dish.ingredients.some((ing) => ing.toLowerCase().includes(query)),
      )
    }

    // Indian cuisine filter
    if (indianCuisineFilter) {
      result = result.filter((dish) =>
        dish.ethnoTag.some(
          (tag) => tag === "Indian" || tag === "South Indian" || tag === "North Indian" || tag === "South Asian",
        ),
      )
    }
    // Ethno tag filter
    else if (selectedEthnoTags.length > 0) {
      result = result.filter((dish) => dish.ethnoTag.some((tag) => selectedEthnoTags.includes(tag)))
    }

    // Price range filter - handle different currencies
    result = result.filter((dish) => {
      // Convert all to a common currency for comparison (simplified)
      const normalizedPrice = dish.currency === "₹" ? dish.price / 80 : dish.price // Approximate conversion
      const normalizedMin = priceRange[0] / (selectedEthnoTags.includes("Indian") ? 80 : 1)
      const normalizedMax = priceRange[1] / (selectedEthnoTags.includes("Indian") ? 80 : 1)

      return normalizedPrice >= normalizedMin && normalizedPrice <= normalizedMax
    })

    // Carbon score filter
    if (carbonFilter.length > 0) {
      result = result.filter((dish) => carbonFilter.includes(dish.carbonScore))
    }

    // Dietary filters
    if (dietaryFilters.vegetarian) {
      result = result.filter((dish) => dish.isVegetarian)
    }
    if (dietaryFilters.vegan) {
      result = result.filter((dish) => dish.isVegan)
    }
    if (dietaryFilters.glutenFree) {
      result = result.filter((dish) => dish.isGlutenFree)
    }

    setFilteredDishes(result)
  }, [searchQuery, selectedEthnoTags, priceRange, carbonFilter, dietaryFilters, indianCuisineFilter])

  const handleEthnoTagChange = (tag: string) => {
    setSelectedEthnoTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleCarbonFilterChange = (score: "Low" | "Medium" | "High") => {
    setCarbonFilter((prev) => (prev.includes(score) ? prev.filter((s) => s !== score) : [...prev, score]))
  }

  const handleDietaryFilterChange = (filter: keyof typeof dietaryFilters) => {
    setDietaryFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  const addToSelection = (dish: Dish) => {
    if (!selectedDishes.some((d) => d.id === dish.id)) {
      setSelectedDishes((prev) => [...prev, dish])
      toast({
        title: "Added to Meal Plan",
        description: `${dish.name} has been added to your meal plan.`,
        duration: 3000,
      })
    } else {
      toast({
        title: "Already in Meal Plan",
        description: `${dish.name} is already in your meal plan.`,
        duration: 3000,
      })
    }
  }

  const removeFromSelection = (dishId: string) => {
    setSelectedDishes((prev) => prev.filter((dish) => dish.id !== dishId))
    toast({
      title: "Removed from Meal Plan",
      description: "Item has been removed from your meal plan.",
      duration: 3000,
    })
  }

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

  const saveMealPlan = () => {
    // In a real app, this would save to a database
    toast({
      title: "Meal Plan Saved",
      description: `Your meal plan with ${selectedDishes.length} items has been saved.`,
      duration: 3000,
    })
  }

  const handleOrderMeals = () => {
    // Store selected dishes in localStorage to be accessed by the order page
    localStorage.setItem('plannedMeals', JSON.stringify(selectedDishes))
    // Navigate to order page
    window.location.href = '/order?fromMealPlan=true'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            Sustainable Dining
          </div>
          <h1 className="text-3xl font-bold mb-2">Smart Meal Planner</h1>
          <p className="text-muted-foreground">
            Discover climate-smart meals that are ethno-specific, economically viable, low-carbon emitting, and
            nutritious.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - Dish selection */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search dishes, ingredients..."
                  className="pl-8 border-primary/20 focus-visible:ring-primary/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={indianCuisineFilter ? "default" : "outline"}
                  className={`gap-2 ${!indianCuisineFilter ? "border-primary/20 text-primary hover:bg-primary/10 hover:text-primary" : ""}`}
                  onClick={() => setIndianCuisineFilter(!indianCuisineFilter)}
                >
                  {indianCuisineFilter && <Check className="h-4 w-4" />}
                  Indian Cuisine
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Dishes</SheetTitle>
                      <SheetDescription>Customize your meal options based on preferences</SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                      {/* Price Range Filter */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price-range" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            Price Range: {selectedEthnoTags.includes("Indian") ? "₹" : "$"}
                            {priceRange[0]} - {selectedEthnoTags.includes("Indian") ? "₹" : "$"}
                            {priceRange[1]}
                          </Label>
                        </div>
                        <Slider
                          id="price-range"
                          defaultValue={[0, 300]}
                          max={selectedEthnoTags.includes("Indian") ? 300 : 20}
                          step={selectedEthnoTags.includes("Indian") ? 10 : 0.5}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="[&>span:first-child]:bg-primary [&>span:last-child]:bg-primary"
                        />
                      </div>

                      {/* Carbon Score Filter */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          Carbon Footprint
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {(["Low", "Medium", "High"] as const).map((score) => (
                            <Badge
                              key={score}
                              variant={carbonFilter.includes(score) ? "default" : "outline"}
                              className={`cursor-pointer ${carbonFilter.includes(score) ? getCarbonScoreClass(score) : ""}`}
                              onClick={() => handleCarbonFilterChange(score)}
                            >
                              {score}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Ethno Tags Filter */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-primary" />
                          Cuisine Type
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {allEthnoTags.map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <Checkbox
                                id={`tag-${tag}`}
                                checked={selectedEthnoTags.includes(tag)}
                                onCheckedChange={() => handleEthnoTagChange(tag)}
                                className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                              />
                              <label
                                htmlFor={`tag-${tag}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dietary Preferences */}
                      <div className="space-y-4">
                        <Label>Dietary Preferences</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegetarian"
                              checked={dietaryFilters.vegetarian}
                              onCheckedChange={() => handleDietaryFilterChange("vegetarian")}
                              className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                              htmlFor="vegetarian"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Vegetarian
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegan"
                              checked={dietaryFilters.vegan}
                              onCheckedChange={() => handleDietaryFilterChange("vegan")}
                              className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                              htmlFor="vegan"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Vegan
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="gluten-free"
                              checked={dietaryFilters.glutenFree}
                              onCheckedChange={() => handleDietaryFilterChange("glutenFree")}
                              className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <label
                              htmlFor="gluten-free"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Gluten Free
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Dish Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <Card
                    key={dish.id}
                    className="overflow-hidden border-primary/10 transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image 
                        src={dish.image || "/placeholder.svg"} 
                        alt={dish.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore} Carbon</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <div className="text-lg font-semibold">
                          {dish.currency}
                          {dish.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dish.ethnoTag.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Calories:</span> {dish.nutrition.calories} |
                        <span className="font-medium"> Protein:</span> {dish.nutrition.protein}g
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDish(dish)}
                        className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addToSelection(dish)}
                        className="bg-primary hover:bg-primary/90"
                        disabled={selectedDishes.some((d) => d.id === dish.id)}
                      >
                        {selectedDishes.some((d) => d.id === dish.id) ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Added
                          </>
                        ) : (
                          "Add to Plan"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No dishes match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Selected dishes and analysis */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="border-primary/20 sticky top-20">
              <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Your Meal Plan
                </CardTitle>
                <CardDescription>Selected dishes and nutritional analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {selectedDishes.length > 0 ? (
                  <>
                    {selectedDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex justify-between items-center p-2 border border-primary/10 rounded-md bg-card/50"
                      >
                        <div>
                          <p className="font-medium">{dish.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge className={getCarbonScoreClass(dish.carbonScore) + " text-xs"}>
                              {dish.carbonScore}
                            </Badge>
                            <span>
                              {dish.currency}
                              {dish.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromSelection(dish.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="pt-4 border-t border-primary/10">
                      <div className="flex justify-between mb-2">
                        <span>Total Items:</span>
                        <span>{selectedDishes.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Total Price:</span>
                        <span>
                          {/* Group by currency and sum */}
                          {Object.entries(
                            selectedDishes.reduce(
                              (acc, dish) => {
                                acc[dish.currency] = (acc[dish.currency] || 0) + dish.price
                                return acc
                              },
                              {} as Record<string, number>,
                            ),
                          ).map(([currency, amount], index, array) => (
                            <span key={currency}>
                              {currency}
                              {amount.toFixed(2)}
                              {index < array.length - 1 ? " + " : ""}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Avg. Carbon Footprint:</span>
                        <span>
                          {(
                            selectedDishes.reduce((sum, dish) => sum + dish.carbonFootprint, 0) / selectedDishes.length
                          ).toFixed(1)}{" "}
                          kg CO2e
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Calories:</span>
                        <span>{selectedDishes.reduce((sum, dish) => sum + dish.nutrition.calories, 0)} kcal</span>
                      </div>
                    </div>

                    {/* Carbon vs Nutrition Chart */}
                    {selectedDishes.length > 0 && (
                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          Carbon vs. Nutrition Analysis
                        </h3>
                        <div className="h-64 w-full bg-card/50 p-2 rounded-lg border border-primary/10">
                          <CarbonNutritionChart dishes={selectedDishes} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No dishes selected yet. Add dishes to your meal plan to see analysis.
                    </p>
                  </div>
                )}
              </CardContent>
              {selectedDishes.length > 0 && (
                <CardFooter className="bg-primary/5 rounded-b-lg border-t border-primary/10">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                      onClick={saveMealPlan}
                    >
                      Save Plan
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={handleOrderMeals}
                    >
                      Order Meals
                  </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetail dish={selectedDish} onClose={() => setSelectedDish(null)} onAddToSelection={addToSelection} />
      )}
    </div>
  )
}
