"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { type WasteEntry, wasteEntries } from "@/lib/data"
import { Trash2, Recycle, Gift, CalendarIcon, ClipboardList, MapPin } from "lucide-react"
import WasteAnalyticsDashboard from "@/components/waste-analytics-dashboard"
import WasteSuggestions from "@/components/waste-suggestions"

export default function WasteTracker() {
  const [entries, setEntries] = useState<WasteEntry[]>(wasteEntries)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    source: "Cafeteria" as WasteEntry["source"],
    foodType: "",
    quantity: "",
    disposalMethod: "Compost" as WasteEntry["disposalMethod"],
    mealPeriod: "Lunch" as WasteEntry["mealPeriod"],
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.foodType || !formData.quantity) {
      alert("Please fill in all required fields")
      return
    }

    // Create new entry
    const newEntry: WasteEntry = {
      id: (entries.length + 1).toString(),
      date: formData.date,
      source: formData.source,
      foodType: formData.foodType,
      quantity: Number.parseFloat(formData.quantity),
      disposalMethod: formData.disposalMethod,
      mealPeriod: formData.mealPeriod,
      notes: formData.notes,
    }

    // Add to entries
    setEntries((prev) => [newEntry, ...prev])

    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      source: "Cafeteria",
      foodType: "",
      quantity: "",
      disposalMethod: "Compost",
      mealPeriod: "Lunch",
      notes: "",
    })
  }

  const getDisposalMethodIcon = (method: WasteEntry["disposalMethod"]) => {
    switch (method) {
      case "Compost":
        return <Recycle className="h-6 w-6 text-carbon-low" />
      case "Landfill":
        return <Trash2 className="h-6 w-6 text-carbon-high" />
      case "Donation":
        return <Gift className="h-6 w-6 text-sky-600 dark:text-sky-400" />
      default:
        return null
    }
  }

  const getDisposalMethodClass = (method: WasteEntry["disposalMethod"]) => {
    switch (method) {
      case "Compost":
        return "bg-carbon-low/20 dark:bg-carbon-low/30"
      case "Landfill":
        return "bg-carbon-high/20 dark:bg-carbon-high/30"
      case "Donation":
        return "bg-sky-100 dark:bg-sky-900/30"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            Waste Management
          </div>
          <h1 className="text-3xl font-bold mb-2">Food Waste Tracker</h1>
          <p className="text-muted-foreground">
            Monitor, analyze, and minimize food waste across campus with data-driven insights.
          </p>
        </div>

        <Tabs defaultValue="log" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/80">
            <TabsTrigger
              value="log"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Log Waste
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Smart Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <CardTitle>Log Food Waste</CardTitle>
                </div>
                <CardDescription>
                  Record details about food waste to help track and reduce waste on campus
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Date
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Waste Source
                      </Label>
                      <Select value={formData.source} onValueChange={(value) => handleSelectChange("source", value)}>
                        <SelectTrigger id="source" className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                          <SelectItem value="Event">Campus Event</SelectItem>
                          <SelectItem value="Residential">Residential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foodType">Food Type</Label>
                      <Input
                        id="foodType"
                        name="foodType"
                        placeholder="e.g., Vegetables, Bread, Mixed"
                        value={formData.foodType}
                        onChange={handleInputChange}
                        required
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (kg)</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Weight in kilograms"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        className="border-primary/20 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mealPeriod">Meal Period</Label>
                      <Select
                        value={formData.mealPeriod}
                        onValueChange={(value) => handleSelectChange("mealPeriod", value as WasteEntry["mealPeriod"])}
                      >
                        <SelectTrigger id="mealPeriod" className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select meal period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                          <SelectItem value="Special Event">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="disposalMethod">Disposal Method</Label>
                      <Select
                        value={formData.disposalMethod}
                        onValueChange={(value) =>
                          handleSelectChange("disposalMethod", value as WasteEntry["disposalMethod"])
                        }
                      >
                        <SelectTrigger id="disposalMethod" className="border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select disposal method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Compost">Compost</SelectItem>
                          <SelectItem value="Landfill">Landfill</SelectItem>
                          <SelectItem value="Donation">Donation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional details about the waste"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="border-primary/20 focus-visible:ring-primary/30"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Log Waste Entry
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Waste Entries</CardTitle>
                </div>
                <CardDescription>View and manage your recent waste logging activity</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {entries.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center p-3 border border-primary/10 rounded-lg bg-card/50"
                    >
                      <div className="mr-4">
                        <div className={`${getDisposalMethodClass(entry.disposalMethod)} p-2 rounded-full`}>
                          {getDisposalMethodIcon(entry.disposalMethod)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{entry.foodType}</h4>
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            {entry.source} • {entry.mealPeriod}
                          </span>
                          <span className="font-medium">{entry.quantity} kg</span>
                        </div>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 rounded-b-lg border-t border-primary/10">
                <Button
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  View All Entries
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <WasteAnalyticsDashboard entries={entries} />
          </TabsContent>

          <TabsContent value="suggestions">
            <WasteSuggestions entries={entries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
