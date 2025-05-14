"use client"

import type { WasteEntry } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Utensils, Scale, Recycle, Users, AlertTriangle } from "lucide-react"

interface WasteSuggestionsProps {
  entries: WasteEntry[]
}

export default function WasteSuggestions({ entries }: WasteSuggestionsProps) {
  // Calculate waste by food type
  const wasteByType = entries.reduce(
    (acc, entry) => {
      acc[entry.foodType] = (acc[entry.foodType] || 0) + entry.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  // Get top waste types
  const topWasteTypes = Object.entries(wasteByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type)

  // Calculate waste by source
  const wasteBySource = {
    Cafeteria: entries.filter((e) => e.source === "Cafeteria").reduce((sum, e) => sum + e.quantity, 0),
    Event: entries.filter((e) => e.source === "Event").reduce((sum, e) => sum + e.quantity, 0),
    Residential: entries.filter((e) => e.source === "Residential").reduce((sum, e) => sum + e.quantity, 0),
  }

  // Determine top waste source
  const topWasteSource = Object.entries(wasteBySource).sort((a, b) => b[1] - a[1])[0][0]

  // Calculate waste by meal period
  const wasteByMeal = {
    Breakfast: entries.filter((e) => e.mealPeriod === "Breakfast").reduce((sum, e) => sum + e.quantity, 0),
    Lunch: entries.filter((e) => e.mealPeriod === "Lunch").reduce((sum, e) => sum + e.quantity, 0),
    Dinner: entries.filter((e) => e.mealPeriod === "Dinner").reduce((sum, e) => sum + e.quantity, 0),
    "Special Event": entries.filter((e) => e.mealPeriod === "Special Event").reduce((sum, e) => sum + e.quantity, 0),
  }

  // Determine top waste meal period
  const topWasteMeal = Object.entries(wasteByMeal).sort((a, b) => b[1] - a[1])[0][0]

  // Calculate disposal methods
  const disposalMethods = {
    Compost: entries.filter((e) => e.disposalMethod === "Compost").length,
    Landfill: entries.filter((e) => e.disposalMethod === "Landfill").length,
    Donation: entries.filter((e) => e.disposalMethod === "Donation").length,
  }

  // Generate suggestions based on data analysis
  const menuSuggestions = [
    `Reduce portion sizes for ${topWasteTypes[0]} dishes to minimize leftovers`,
    `Consider reformulating recipes that use ${topWasteTypes[1]} to improve consumption rates`,
    `Offer ${topWasteTypes[2]} as optional side dishes rather than default inclusions`,
    `Implement a "taste before you take" policy for commonly wasted items`,
    `Adjust menu planning to reduce ${topWasteTypes[0]} offerings during ${topWasteMeal}`,
  ]

  const portionSuggestions = [
    `Implement variable portion sizes (small, medium, large) for ${topWasteMeal} meals`,
    `Use smaller serving utensils for frequently wasted items`,
    `Train serving staff on appropriate portion sizes`,
    `Implement a self-service model where students can take only what they need`,
    `Conduct regular plate waste audits to fine-tune portion sizes`,
  ]

  const disposalSuggestions = [
    `Increase composting capacity to handle peak waste periods`,
    `Partner with local farms to establish a food waste-to-animal feed program`,
    `Implement a food donation program for safe, unused prepared foods`,
    `Create clear signage for proper waste sorting to increase composting rates`,
    `Establish a campus-wide food waste tracking competition between residence halls`,
  ]

  const educationSuggestions = [
    `Launch an awareness campaign about the environmental impact of food waste`,
    `Host workshops on meal planning and food storage for students`,
    `Create informational displays showing the carbon footprint of wasted food`,
    `Implement a "Clean Plate Club" incentive program`,
    `Develop a food waste dashboard displayed in dining areas`,
  ]

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle>Waste Insights</CardTitle>
          </div>
          <CardDescription>Key insights based on your waste tracking data</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-primary/10 rounded-lg p-4 bg-card/50">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                Top Wasted Food Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {topWasteTypes.map((type, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border border-primary/10 rounded-lg p-4 bg-card/50">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Highest Waste Sources
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {topWasteSource}
                </Badge>
                <Badge variant="outline" className="border-secondary/20 text-secondary">
                  {topWasteMeal}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border border-primary/10 rounded-lg p-4 bg-card/50">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Recycle className="h-4 w-4 text-primary" />
              Current Disposal Methods
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-carbon-low/10 p-2 rounded-md">
                <div className="text-lg font-bold">{disposalMethods.Compost}</div>
                <div className="text-sm text-muted-foreground">Composted</div>
              </div>
              <div className="bg-carbon-high/10 p-2 rounded-md">
                <div className="text-lg font-bold">{disposalMethods.Landfill}</div>
                <div className="text-sm text-muted-foreground">Landfill</div>
              </div>
              <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-md">
                <div className="text-lg font-bold">{disposalMethods.Donation}</div>
                <div className="text-sm text-muted-foreground">Donated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              <CardTitle>Menu Adjustments</CardTitle>
            </div>
            <CardDescription>Suggestions for menu changes to reduce waste</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {menuSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <CardTitle>Portion Control</CardTitle>
            </div>
            <CardDescription>Strategies to optimize serving sizes</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {portionSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-primary" />
              <CardTitle>Waste Disposal Improvements</CardTitle>
            </div>
            <CardDescription>Better ways to handle inevitable food waste</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {disposalSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Education & Awareness</CardTitle>
            </div>
            <CardDescription>Programs to increase awareness and change behavior</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {educationSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
