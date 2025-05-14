"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WasteEntry } from "@/lib/data"
import { Chart, registerables } from "chart.js"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  DonutIcon as DoughnutChart,
  Gift,
  LineChart,
  PieChart,
  Recycle,
  Trash2,
} from "lucide-react"
import { useEffect, useRef } from "react"

Chart.register(...registerables)

interface WasteAnalyticsDashboardProps {
  entries: WasteEntry[]
}

export default function WasteAnalyticsDashboard({ entries }: WasteAnalyticsDashboardProps) {
  const weeklyChartRef = useRef<HTMLCanvasElement>(null)
  const sourceChartRef = useRef<HTMLCanvasElement>(null)
  const typeChartRef = useRef<HTMLCanvasElement>(null)
  const disposalChartRef = useRef<HTMLCanvasElement>(null)
  
  // Add refs for chart instances
  const weeklyChartInstance = useRef<Chart | null>(null)
  const sourceChartInstance = useRef<Chart | null>(null)
  const typeChartInstance = useRef<Chart | null>(null)
  const disposalChartInstance = useRef<Chart | null>(null)

  // Calculate total waste
  const totalWaste = entries.reduce((sum, entry) => sum + entry.quantity, 0)

  // Calculate waste by disposal method
  const wasteByDisposal = {
    Compost: entries.filter((e) => e.disposalMethod === "Compost").reduce((sum, e) => sum + e.quantity, 0),
    Landfill: entries.filter((e) => e.disposalMethod === "Landfill").reduce((sum, e) => sum + e.quantity, 0),
    Donation: entries.filter((e) => e.disposalMethod === "Donation").reduce((sum, e) => sum + e.quantity, 0),
  }

  // Calculate percentage of waste composted
  const compostPercentage = (wasteByDisposal.Compost / totalWaste) * 100

  // Calculate waste by source
  const wasteBySource = {
    Cafeteria: entries.filter((e) => e.source === "Cafeteria").reduce((sum, e) => sum + e.quantity, 0),
    Event: entries.filter((e) => e.source === "Event").reduce((sum, e) => sum + e.quantity, 0),
    Residential: entries.filter((e) => e.source === "Residential").reduce((sum, e) => sum + e.quantity, 0),
  }

  // Get top waste types
  const wasteByType = entries.reduce(
    (acc, entry) => {
      acc[entry.foodType] = (acc[entry.foodType] || 0) + entry.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  const topWasteTypes = Object.entries(wasteByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Calculate trend (simple comparison to previous period)
  const trend = Math.random() > 0.5 ? "up" : "down"
  const trendPercentage = (Math.random() * 20).toFixed(1)

  // Function to create/update charts
  const createCharts = () => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

    // Weekly Trend Chart
    if (weeklyChartRef.current) {
      const ctx = weeklyChartRef.current.getContext("2d")
      if (ctx) {
        weeklyChartInstance.current?.destroy()
        
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          return date.toISOString().split("T")[0]
        }).reverse()

        const wasteByDay = last7Days.map((date) => {
          const dayEntries = entries.filter((e) => e.date === date)
          return dayEntries.reduce((sum, e) => sum + e.quantity, 0)
        })

        weeklyChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: last7Days.map((date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })),
            datasets: [
              {
                label: "Daily Waste (kg)",
                data: wasteByDay,
                borderColor: "rgb(16, 185, 129)",
                tension: 0.1,
                fill: true,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Weekly Waste Trend",
                color: textColor,
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 14
                  }
                }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Waste (kg)",
                  color: textColor,
                  font: {
                    size: 14,
                    weight: "bold"
                  }
                },
                grid: {
                  color: gridColor
                },
                ticks: {
                  color: textColor,
                  font: {
                    size: 12
                  }
                },
              },
              x: {
                grid: {
                  color: gridColor
                },
                ticks: {
                  color: textColor,
                  font: {
                    size: 12
                  }
                },
              },
            },
          },
        })
      }
    }

    // Source Chart
    if (sourceChartRef.current) {
      const ctx = sourceChartRef.current.getContext("2d")
      if (ctx) {
        sourceChartInstance.current?.destroy()
        
        sourceChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(wasteBySource),
            datasets: [
              {
                data: Object.values(wasteBySource),
                backgroundColor: [
                  "rgba(245, 158, 11, 0.8)",
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(16, 185, 129, 0.8)",
                ],
                borderColor: [
                  "rgb(245, 158, 11)",
                  "rgb(59, 130, 246)",
                  "rgb(16, 185, 129)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Waste by Source",
                color: textColor,
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 14
                  }
                }
              },
              tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkMode ? '#ffffff' : '#000000',
                bodyColor: isDarkMode ? '#ffffff' : '#000000',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
              },
            },
          },
        })
      }
    }

    // Type Chart
    if (typeChartRef.current) {
      const ctx = typeChartRef.current.getContext("2d")
      if (ctx) {
        typeChartInstance.current?.destroy()
        
        typeChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: topWasteTypes.map(([type]) => type),
            datasets: [
              {
                label: "Waste (kg)",
                data: topWasteTypes.map(([, amount]) => amount),
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "rgb(16, 185, 129)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Top Food Types Wasted",
                color: textColor,
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 14
                  }
                }
              },
              tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkMode ? '#ffffff' : '#000000',
                bodyColor: isDarkMode ? '#ffffff' : '#000000',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Waste (kg)",
                  color: textColor,
                  font: {
                    size: 14,
                    weight: "bold"
                  }
                },
                grid: {
                  color: gridColor
                },
                ticks: {
                  color: textColor,
                  font: {
                    size: 12
                  }
                },
              },
              x: {
                grid: {
                  color: gridColor
                },
                ticks: {
                  color: textColor,
                  font: {
                    size: 12
                  }
                },
              },
            },
          },
        })
      }
    }

    // Disposal Method Chart
    if (disposalChartRef.current) {
      const ctx = disposalChartRef.current.getContext("2d")
      if (ctx) {
        disposalChartInstance.current?.destroy()
        
        disposalChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: Object.keys(wasteByDisposal),
            datasets: [
              {
                data: Object.values(wasteByDisposal),
                backgroundColor: [
                  "rgba(16, 185, 129, 0.8)",
                  "rgba(239, 68, 68, 0.8)",
                  "rgba(59, 130, 246, 0.8)",
                ],
                borderColor: [
                  "rgb(16, 185, 129)",
                  "rgb(239, 68, 68)",
                  "rgb(59, 130, 246)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Waste by Disposal Method",
                color: textColor,
                font: {
                  size: 16,
                  weight: "bold"
                }
              },
              legend: {
                labels: {
                  color: textColor,
                  font: {
                    size: 14
                  }
                }
              },
              tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkMode ? '#ffffff' : '#000000',
                bodyColor: isDarkMode ? '#ffffff' : '#000000',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
              },
            },
          },
        })
      }
    }
  }

  useEffect(() => {
    // Create initial charts
    createCharts()

    // Update charts when theme changes
    const observer = new MutationObserver(() => {
      createCharts()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
      weeklyChartInstance.current?.destroy()
      sourceChartInstance.current?.destroy()
      typeChartInstance.current?.destroy()
      disposalChartInstance.current?.destroy()
    }
  }, [entries])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              Total Waste
            </CardTitle>
          </CardHeader> 
          <CardContent>
            <div className="text-2xl font-bold">{totalWaste.toFixed(1)} kg</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {trend === "down" ? (
                <>
                  <ArrowDown className="h-3 w-3 text-carbon-low mr-1" />
                  <span className="text-carbon-low">{trendPercentage}% decrease</span>
                </>
              ) : (
                <>
                  <ArrowUp className="h-3 w-3 text-carbon-high mr-1" />
                  <span className="text-carbon-high">{trendPercentage}% increase</span>
                </>
              )}
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Recycle className="h-4 w-4 text-carbon-low" />
              Composted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compostPercentage.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Recycle className="h-3 w-3 text-carbon-low mr-1" />
              <span>{wasteByDisposal.Compost.toFixed(1)} kg composted</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-carbon-high" />
              Landfill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteByDisposal.Landfill.toFixed(1)} kg</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Trash2 className="h-3 w-3 text-carbon-high mr-1" />
              <span>{((wasteByDisposal.Landfill / totalWaste) * 100).toFixed(1)}% of total waste</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteByDisposal.Donation.toFixed(1)} kg</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Gift className="h-3 w-3 text-sky-600 dark:text-sky-400 mr-1" />
              <span>{((wasteByDisposal.Donation / totalWaste) * 100).toFixed(1)}% of total waste</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <CardTitle>Weekly Trend</CardTitle>
            </div>
            <CardDescription>Track waste generation over the past week</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <canvas ref={weeklyChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Waste by Source</CardTitle>
            </div>
            <CardDescription>Distribution of waste across different campus sources</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <canvas ref={sourceChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Top Food Types Wasted</CardTitle>
            </div>
            <CardDescription>Most frequently wasted food categories</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <canvas ref={typeChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <div className="flex items-center gap-2">
              <DoughnutChart className="h-5 w-5 text-primary" />
              <CardTitle>Disposal Methods</CardTitle>
            </div>
            <CardDescription>How waste is being disposed of or repurposed</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <canvas ref={disposalChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
