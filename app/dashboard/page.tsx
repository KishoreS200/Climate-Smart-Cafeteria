"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { locations, type Location, type Farm, farms } from "@/lib/data"
import { TrendingUp, Award, MapPin, Leaf, Calendar } from "lucide-react"

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)

  // Sort locations by sustainability score
  const sortedLocations = [...locations].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sustainability Dashboard</h1>
          <p className="text-muted-foreground">Track campus-wide sustainability metrics and connect with local farms</p>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Campus Leaderboard</TabsTrigger>
            <TabsTrigger value="farms">Local Farm Network</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Waste Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(locations.reduce((sum, loc) => sum + loc.wasteReduction, 0) / locations.length).toFixed(1)}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">5.2% increase</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Carbon Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {locations.reduce((sum, loc) => sum + loc.carbonSaved, 0).toLocaleString()} kg
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">12.8% increase</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sortedLocations[0].name}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Award className="h-3 w-3 text-amber-500 mr-1" />
                    <span>Sustainability Score: {sortedLocations[0].sustainabilityScore}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Campus Sustainability Leaderboard</CardTitle>
                <CardDescription>Tracking waste reduction and sustainability across campus locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${selectedLocation?.id === location.id ? "bg-muted/50 border-primary" : ""}`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="mr-4 flex-shrink-0 w-8 text-center font-bold text-lg">#{index + 1}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{location.name}</h4>
                          <Badge variant={index < 3 ? "default" : "outline"}>{location.type}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Waste Reduction:</span>{" "}
                            <span className="font-medium">{location.wasteReduction}%</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Carbon Saved:</span>{" "}
                            <span className="font-medium">{location.carbonSaved.toLocaleString()} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Farm Partners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farms.length}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">2 new</span>
                    <span className="ml-1">since last quarter</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(farms.reduce((sum, farm) => sum + farm.distance, 0) / farms.length).toFixed(1)} miles
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 text-green-500 mr-1" />
                    <span>Local sourcing</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sustainable Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((farms.filter((farm) => farm.sustainable).length / farms.length) * 100).toFixed(0)}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Leaf className="h-3 w-3 text-green-500 mr-1" />
                    <span>Eco-friendly farming</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Local Farm Network</CardTitle>
                <CardDescription>
                  Partnering with local farms to reduce food miles and support sustainable agriculture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${selectedFarm?.id === farm.id ? "bg-muted/50 border-primary" : ""}`}
                      onClick={() => setSelectedFarm(farm)}
                    >
                      <div className="mr-4 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{farm.name}</h4>
                          <Badge
                            variant={farm.sustainable ? "default" : "outline"}
                            className={farm.sustainable ? "bg-carbon-low" : ""}
                          >
                            {farm.sustainable ? "Sustainable" : "Standard"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{farm.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {farm.products.map((product, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Distance:</span>{" "}
                          <span className="font-medium">{farm.distance} miles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Calendar</CardTitle>
                <CardDescription>Plan your menu based on seasonal availability from our farm partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["Spring", "Summer", "Fall", "Winter"].map((season) => (
                    <Card key={season}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <CardTitle className="text-sm">{season}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <ul className="space-y-1">
                          {season === "Spring" && (
                            <>
                              <li>Leafy Greens</li>
                              <li>Asparagus</li>
                              <li>Strawberries</li>
                              <li>Peas</li>
                            </>
                          )}
                          {season === "Summer" && (
                            <>
                              <li>Tomatoes</li>
                              <li>Corn</li>
                              <li>Berries</li>
                              <li>Peppers</li>
                            </>
                          )}
                          {season === "Fall" && (
                            <>
                              <li>Apples</li>
                              <li>Pumpkins</li>
                              <li>Root Vegetables</li>
                              <li>Squash</li>
                            </>
                          )}
                          {season === "Winter" && (
                            <>
                              <li>Citrus</li>
                              <li>Kale</li>
                              <li>Potatoes</li>
                              <li>Winter Squash</li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
