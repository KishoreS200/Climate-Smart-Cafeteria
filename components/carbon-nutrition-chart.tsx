"use client"

import type { Dish } from "@/lib/data"
import { Chart, registerables } from "chart.js"
import { useEffect, useRef } from "react"

Chart.register(...registerables)

interface CarbonNutritionChartProps {
  dishes: Dish[]
}

export default function CarbonNutritionChart({ dishes }: CarbonNutritionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Function to create/update chart
  const createChart = () => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Get theme colors
    const isDarkMode = document.documentElement.classList.contains('dark')
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

    // Prepare data
    const data = dishes.map((dish) => ({
      x: dish.carbonFootprint,
      y: dish.nutrition.protein + dish.nutrition.fiber, // Simple nutrition score
      r: dish.nutrition.calories / 50, // Size based on calories
      name: dish.name,
      carbonScore: dish.carbonScore,
    }))

    // Create new chart with eco-friendly colors
    chartInstance.current = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Dishes",
            data: data,
            backgroundColor: data.map((item) => {
              switch (item.carbonScore) {
                case "Low":
                  return "rgba(74, 222, 128, 0.6)" // Green for low carbon
                case "Medium":
                  return "rgba(250, 204, 21, 0.6)" // Yellow for medium carbon
                case "High":
                  return "rgba(248, 113, 113, 0.6)" // Red for high carbon
                default:
                  return "rgba(75, 192, 192, 0.6)"
              }
            }),
            borderColor: data.map((item) => {
              switch (item.carbonScore) {
                case "Low":
                  return "rgba(74, 222, 128, 1)" // Green for low carbon
                case "Medium":
                  return "rgba(250, 204, 21, 1)" // Yellow for medium carbon
                case "High":
                  return "rgba(248, 113, 113, 1)" // Red for high carbon
                default:
                  return "rgba(75, 192, 192, 1)"
              }
            }),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Carbon Footprint (kg CO2e)",
              color: textColor,
            },
            beginAtZero: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
          y: {
            title: {
              display: true,
              text: "Nutrition Score (Protein + Fiber)",
              color: textColor,
            },
            beginAtZero: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = data[context.dataIndex]
                return [
                  `${item.name}`,
                  `Carbon: ${item.x} kg CO2e`,
                  `Nutrition Score: ${item.y}`,
                  `Calories: ${dishes[context.dataIndex].nutrition.calories}`,
                ]
              },
            },
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            titleColor: isDarkMode ? '#ffffff' : '#000000',
            bodyColor: isDarkMode ? '#ffffff' : '#000000',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
          },
          legend: {
            display: true,
            labels: {
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

  useEffect(() => {
    // Create initial chart
    createChart()

    // Update chart colors when theme changes
    const observer = new MutationObserver(() => {
      createChart()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [dishes])

  return (
    <div className="relative w-full h-full">
      <canvas ref={chartRef} className="w-full h-full" />
      <div className="absolute bottom-0 right-0 bg-card/90 backdrop-blur-sm p-2 rounded-tl-md text-xs flex flex-col gap-1 border border-border">
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-[rgba(74,222,128,0.6)] border border-[rgba(74,222,128,1)]"></span>
          <span className="text-foreground">Low Carbon</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-[rgba(250,204,21,0.6)] border border-[rgba(250,204,21,1)]"></span>
          <span className="text-foreground">Medium Carbon</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-[rgba(248,113,113,0.6)] border border-[rgba(248,113,113,1)]"></span>
          <span className="text-foreground">High Carbon</span>
        </div>
      </div>
    </div>
  )
}
