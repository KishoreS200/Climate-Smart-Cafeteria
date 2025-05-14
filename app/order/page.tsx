"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { type Dish, dishes } from "@/lib/data"
import { ArrowRight, Check, Clock, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type CartItem = Dish & { 
  quantity: number;
  price: number;
}

export default function OrderPage() {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [pickupTime, setPickupTime] = useState("")
  const [indianCuisineFilter, setIndianCuisineFilter] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<Dish | null>(null)
  const [lastRemovedItem, setLastRemovedItem] = useState<string | null>(null)
  const [lastOrderPlaced, setLastOrderPlaced] = useState(false)
  const initialLoadRef = useRef(true)

  useEffect(() => {
    if (!initialLoadRef.current && lastAddedItem) {
      toast({
        title: "Added to Order",
        description: `${lastAddedItem.name} has been added to your order.`,
        duration: 3000,
      })
      setLastAddedItem(null)
    }
  }, [lastAddedItem, toast])

  useEffect(() => {
    // Check if we're coming from meal planner
    const urlParams = new URLSearchParams(window.location.search)
    const fromMealPlan = urlParams.get('fromMealPlan')
    
    if (fromMealPlan) {
      const plannedMeals = localStorage.getItem('plannedMeals')
      if (plannedMeals) {
        const meals = JSON.parse(plannedMeals)
        // Add each meal to cart
        meals.forEach((meal: any) => {
          addToCart(meal)
        })
        // Clear the planned meals from localStorage
        localStorage.removeItem('plannedMeals')
      }
    }
    
    initialLoadRef.current = false
  }, [])

  // Separate useEffect for showing the toast after meals are added
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const fromMealPlan = urlParams.get('fromMealPlan')
    
    if (fromMealPlan && cart.length > 0 && !initialLoadRef.current) {
      toast({
        title: "Meals Added to Cart",
        description: "Your planned meals have been added to your cart. Low carbon meals have received a 10% discount!",
        duration: 3000,
      })
    }
  }, [cart, toast])

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === dish.id)
      if (existingItem) {
        return prev.map((item) => 
          item.id === dish.id 
            ? { 
                ...item, 
                quantity: item.quantity + 1
              } 
            : item
        )
      } else {
        return [...prev, { 
          ...dish, 
          quantity: 1
        }]
      }
    })
    setLastAddedItem(dish)
  }

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const result = prev.filter((item) => item.id !== dishId)
      if (result.length < prev.length) {
        setLastRemovedItem(dishId)
      }
      return result
    })
  }

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity < 1) return

    setCart((prev) => prev.map((item) => (item.id === dishId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    // Group by currency
    const totals: Record<string, number> = {}

    cart.forEach((item) => {
      const currency = item.currency
      totals[currency] = (totals[currency] || 0) + item.price * item.quantity
    })

    return totals
  }

  const calculateDiscount = () => {
    // Calculate total carbon footprint
    const totalCarbon = calculateTotalCarbon()
    
    // Apply discount based on carbon footprint
    // 10% discount for orders with average carbon footprint < 1 kg CO2e
    // 5% discount for orders with average carbon footprint < 2 kg CO2e
    const averageCarbon = totalCarbon / cart.reduce((sum, item) => sum + item.quantity, 0)
    
    if (averageCarbon < 1) {
      return 0.1 // 10% discount
    } else if (averageCarbon < 2) {
      return 0.05 // 5% discount
    }
    return 0 // No discount
  }

  const calculateDiscountedTotal = () => {
    // Group by currency
    const totals: Record<string, number> = {}
    const discountedTotals: Record<string, number> = {}

    cart.forEach((item) => {
      const currency = item.currency
      const itemTotal = item.price * item.quantity
      totals[currency] = (totals[currency] || 0) + itemTotal
      
      // Only apply discount to low carbon items
      if (item.carbonScore === "Low") {
        discountedTotals[currency] = (discountedTotals[currency] || 0) + (itemTotal * 0.9) // 10% discount
      } else {
        discountedTotals[currency] = (discountedTotals[currency] || 0) + itemTotal
      }
    })

    return { totals, discountedTotals }
  }

  const calculateTotalCarbon = () => {
    return cart.reduce((total, item) => total + item.carbonFootprint * item.quantity, 0)
  }

  const handlePlaceOrder = () => {
    // In a real app, this would send the order to a server
    setOrderPlaced(true)
    setLastOrderPlaced(true)
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

  const filteredDishes = indianCuisineFilter
    ? dishes.filter((dish) =>
        dish.ethnoTag.some(
          (tag) => tag === "Indian" || tag === "South Indian" || tag === "North Indian" || tag === "South Asian",
        ),
      )
    : dishes

  useEffect(() => {
    if (lastRemovedItem) {
      toast({
        title: "Removed from Order",
        description: "Item has been removed from your order.",
        duration: 3000,
      })
      setLastRemovedItem(null)
    }
  }, [lastRemovedItem, toast])

  useEffect(() => {
    if (lastOrderPlaced) {
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
        duration: 3000,
      })
      setLastOrderPlaced(false)
    }
  }, [lastOrderPlaced, toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Food</h1>
          <p className="text-muted-foreground">Order climate-smart meals for pickup or delivery</p>
        </div>

        {orderPlaced ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-center">Order Placed Successfully!</CardTitle>
              <CardDescription className="text-center">
                Your order has been received and is being prepared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-t border-b py-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order Number:</span>
                  <span>CSC-{Math.floor(Math.random() * 10000)}</span>
                </div>
                {pickupTime && (
                  <div className="flex justify-between">
                    <span className="font-medium">Pickup Time:</span>
                    <span>{pickupTime}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Summary:</h3>
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                        {item.carbonScore === "Low" && calculateDiscount() > 0 && (
                          <span className="ml-2 text-green-600 text-sm">
                            ({calculateDiscount() * 100}% discount applied)
                          </span>
                        )}
                      </span>
                      <span>
                        {item.currency}
                        {item.carbonScore === "Low" && calculateDiscount() > 0
                          ? (item.price * item.quantity * (1 - calculateDiscount())).toFixed(2)
                          : (item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 mt-4 pt-2 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <div>
                      {Object.entries(calculateDiscountedTotal().totals).map(([currency, amount], index, array) => (
                        <span key={currency}>
                          {currency}
                          {amount.toFixed(2)}
                          {index < array.length - 1 ? " + " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Carbon Discount ({calculateDiscount() * 100}% on Low Carbon items):</span>
                      <div>
                        {Object.entries(calculateDiscountedTotal().totals).map(([currency, amount], index, array) => {
                          const discountedAmount = calculateDiscountedTotal().discountedTotals[currency]
                          const discountAmount = amount - discountedAmount
                          return (
                            <span key={currency}>
                              -{currency}
                              {discountAmount.toFixed(2)}
                              {index < array.length - 1 ? " + " : ""}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <div>
                      {Object.entries(calculateDiscountedTotal().discountedTotals).map(([currency, amount], index, array) => (
                      <span key={currency}>
                        {currency}
                        {amount.toFixed(2)}
                        {index < array.length - 1 ? " + " : ""}
                      </span>
                    ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-md dark:bg-green-900/30">
                <p className="text-sm text-center">
                  By choosing climate-smart meals, you've saved approximately{" "}
                  <span className="font-bold">{(5 - calculateTotalCarbon()).toFixed(1)} kg</span> of CO2 emissions
                  compared to conventional options!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => window.location.reload()}>
                Place Another Order
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Menu Section */}
            <div className="w-full lg:w-2/3">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="low-carbon">Low Carbon</TabsTrigger>
                    <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                  </TabsList>

                  <Button
                    variant={indianCuisineFilter ? "default" : "outline"}
                    className={`gap-2 ${!indianCuisineFilter ? "border-primary/20 text-primary hover:bg-primary/10 hover:text-primary" : ""}`}
                    onClick={() => setIndianCuisineFilter(!indianCuisineFilter)}
                  >
                    {indianCuisineFilter && <Check className="h-4 w-4" />}
                    Indian Cuisine
                  </Button>
                </div>

                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDishes.map((dish) => (
                      <Card
                        key={dish.id}
                        className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all"
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
                            <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore}</Badge>
                          </div>
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{dish.name}</CardTitle>
                            <span className="font-bold">
                              {dish.currency}
                              {dish.price.toFixed(2)}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dish.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {dish.ethnoTag.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {dish.isVegetarian && (
                              <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30">
                                Vegetarian
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            onClick={() => addToCart(dish)}
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={cart.some((item) => item.id === dish.id && item.quantity >= 5)}
                          >
                            {cart.some((item) => item.id === dish.id) ? (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {cart.find((item) => item.id === dish.id)?.quantity || 0} in Cart
                              </>
                            ) : (
                              "Add to Order"
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="low-carbon" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDishes
                      .filter((dish) => dish.carbonScore === "Low")
                      .map((dish) => (
                        <Card
                          key={dish.id}
                          className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all"
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
                              <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore}</Badge>
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{dish.name}</CardTitle>
                              <span className="font-bold">
                                {dish.currency}
                                {dish.price.toFixed(2)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dish.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {dish.ethnoTag.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {dish.isVegetarian && (
                                <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30">
                                  Vegetarian
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button
                              onClick={() => addToCart(dish)}
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={cart.some((item) => item.id === dish.id && item.quantity >= 5)}
                            >
                              {cart.some((item) => item.id === dish.id) ? (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  {cart.find((item) => item.id === dish.id)?.quantity || 0} in Cart
                                </>
                              ) : (
                                "Add to Order"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="vegetarian" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDishes
                      .filter((dish) => dish.isVegetarian)
                      .map((dish) => (
                        <Card
                          key={dish.id}
                          className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all"
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
                              <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore}</Badge>
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{dish.name}</CardTitle>
                              <span className="font-bold">
                                {dish.currency}
                                {dish.price.toFixed(2)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dish.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {dish.ethnoTag.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30">
                                Vegetarian
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button
                              onClick={() => addToCart(dish)}
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={cart.some((item) => item.id === dish.id && item.quantity >= 5)}
                            >
                              {cart.some((item) => item.id === dish.id) ? (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  {cart.find((item) => item.id === dish.id)?.quantity || 0} in Cart
                                </>
                              ) : (
                                "Add to Order"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="popular" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDishes
                      .filter((dish) => dish.popularity >= 8)
                      .map((dish) => (
                        <Card
                          key={dish.id}
                          className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all"
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
                              <Badge className={getCarbonScoreClass(dish.carbonScore)}>{dish.carbonScore}</Badge>
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-0">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{dish.name}</CardTitle>
                              <span className="font-bold">
                                {dish.currency}
                                {dish.price.toFixed(2)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dish.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {dish.ethnoTag.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs bg-secondary/10 text-secondary-foreground border-secondary/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {dish.isVegetarian && (
                                <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30">
                                  Vegetarian
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button
                              onClick={() => addToCart(dish)}
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={cart.some((item) => item.id === dish.id && item.quantity >= 5)}
                            >
                              {cart.some((item) => item.id === dish.id) ? (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  {cart.find((item) => item.id === dish.id)?.quantity || 0} in Cart
                                </>
                              ) : (
                                "Add to Order"
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Cart Section */}
            <div className="w-full lg:w-1/3">
              <Card className="sticky top-20 border-primary/20">
                <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <CardTitle>Your Order</CardTitle>
                  </div>
                  <CardDescription>Review your items before checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {cart.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 border border-primary/10 rounded-md bg-card/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge className={getCarbonScoreClass(item.carbonScore) + " text-xs"}>
                                  {item.carbonScore}
                                </Badge>
                                {item.carbonScore === "Low" ? (
                                  <div className="flex items-center gap-1">
                                    <span className="line-through text-muted-foreground">
                                      {item.currency}{item.price.toFixed(2)}
                                    </span>
                                    <span className="text-green-600">
                                      {item.currency}{(item.price * 0.9).toFixed(2)}
                                    </span>
                                    <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30">
                                      10% off
                                    </Badge>
                                  </div>
                                ) : (
                                  <span>
                                    {item.currency}{item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(item.id)}
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-primary/10 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <div>
                            {Object.entries(calculateDiscountedTotal().totals).map(([currency, amount], index, array) => (
                              <span key={currency}>
                                {currency}
                                {amount.toFixed(2)}
                                {index < array.length - 1 ? " + " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                        {cart.some(item => item.carbonScore === "Low") && (
                          <div className="flex justify-between text-green-600">
                            <span>Carbon Discount (10% on Low Carbon items):</span>
                            <div>
                              {Object.entries(calculateDiscountedTotal().totals).map(([currency, amount], index, array) => {
                                const discountedAmount = calculateDiscountedTotal().discountedTotals[currency]
                                const discountAmount = amount - discountedAmount
                                return (
                                  <span key={currency}>
                                    -{currency}
                                    {discountAmount.toFixed(2)}
                                    {index < array.length - 1 ? " + " : ""}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <div>
                            {Object.entries(calculateDiscountedTotal().discountedTotals).map(([currency, amount], index, array) => (
                              <span key={currency}>
                                {currency}
                                {amount.toFixed(2)}
                                {index < array.length - 1 ? " + " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pickup-time">Pickup Time</Label>
                          <div className="flex gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <Input
                              id="pickup-time"
                              type="time"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="border-primary/20 focus-visible:ring-primary/30"
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={handlePlaceOrder}
                          disabled={cart.length === 0 || !pickupTime}
                        >
                          Place Order
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <span className="inline-block h-3 w-3 rounded-full bg-carbon-low" />
                          Low Carbon: Less than 1 kg CO2e
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="inline-block h-3 w-3 rounded-full bg-carbon-medium" />
                          Medium Carbon: 1-3 kg CO2e
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="inline-block h-3 w-3 rounded-full bg-carbon-high" />
                          High Carbon: More than 3 kg CO2e
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Your cart is empty. Add items to place an order.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
