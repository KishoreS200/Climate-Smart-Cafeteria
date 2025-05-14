import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Leaf, LineChart, Recycle, Users, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Sustainable Campus Dining
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Climate Smart Cafeteria
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Serving sustainable, ethno-specific, and low-carbon meals while minimizing campus food waste through
                  data-driven processes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/meal-planner">
                  <Button className="px-8 bg-primary hover:bg-primary/90">
                    Explore Meals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/waste-tracker">
                  <Button
                    variant="outline"
                    className="px-8 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    Track Waste
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-cafeteria.jpg"
                  alt="Climate Smart Cafeteria - Sustainable dining environment"
                  width={600}
                  height={400}
                  className="object-cover rounded-xl shadow-lg"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">Our Platform</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers comprehensive tools to promote sustainable dining on campus
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card className="border-primary/10 bg-card/50 backdrop-blur transition-all hover:shadow-md hover:border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/meal-planner-bg.jpg"
                  alt="Meal Planning Background"
                  fill
                  className="object-cover opacity-10"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="rounded-full bg-primary/10 p-2">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Meal Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plan meals that are ethno-specific, economically viable, low-carbon emitting, and nutritious.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/meal-planner" className="text-sm text-primary hover:underline">
                  Learn more
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-primary/10 bg-card/50 backdrop-blur transition-all hover:shadow-md hover:border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/waste-tracking-bg.jpg"
                  alt="Waste Tracking Background"
                  fill
                  className="object-cover opacity-10"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="rounded-full bg-primary/10 p-2">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Waste Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor, analyze, and minimize food waste across campus with data-driven insights.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/waste-tracker" className="text-sm text-primary hover:underline">
                  Learn more
                </Link>
              </CardFooter>
            </Card>
            <Card className="border-primary/10 bg-card/50 backdrop-blur transition-all hover:shadow-md hover:border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/sustainability-bg.jpg"
                  alt="Sustainability Background"
                  fill
                  className="object-cover opacity-10"
                />
              </div>
              <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="rounded-full bg-primary/10 p-2">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Sustainability Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track carbon footprint, nutritional value, and waste reduction progress over time.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="text-sm text-primary hover:underline">
                  Learn more
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-leaf-50 dark:bg-leaf-900/30 border-leaf-100 dark:border-leaf-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-leaf-100 dark:bg-leaf-800 p-3 mb-4">
                  <Leaf className="h-6 w-6 text-leaf-700 dark:text-leaf-300" />
                </div>
                <div className="text-3xl font-bold mb-2">30%</div>
                <p className="text-sm text-muted-foreground">Carbon Footprint Reduction</p>
              </CardContent>
            </Card>
            <Card className="bg-earth-50 dark:bg-earth-900/30 border-earth-100 dark:border-earth-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-earth-100 dark:bg-earth-800 p-3 mb-4">
                  <Recycle className="h-6 w-6 text-earth-700 dark:text-earth-300" />
                </div>
                <div className="text-3xl font-bold mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Food Waste Composted</p>
              </CardContent>
            </Card>
            <Card className="bg-sky-50 dark:bg-sky-900/30 border-sky-100 dark:border-sky-800">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-sky-100 dark:bg-sky-800 p-3 mb-4">
                  <Utensils className="h-6 w-6 text-sky-700 dark:text-sky-300" />
                </div>
                <div className="text-3xl font-bold mb-2">12</div>
                <p className="text-sm text-muted-foreground">Local Farm Partnerships</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/20 dark:bg-primary/30 p-3 mb-4">
                  <Users className="h-6 w-6 text-primary dark:text-primary/90" />
                </div>
                <div className="text-3xl font-bold mb-2">5,000+</div>
                <p className="text-sm text-muted-foreground">Students Engaged</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cta-background.jpg"
            alt="Join Climate Smart Movement"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">Get Involved</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the Climate Smart Movement
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Help reduce campus food waste and promote sustainable dining practices
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/meal-planner">
                <Button className="px-8 bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="px-8 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
