"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to a server
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
      duration: 3000,
    })
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-primary/20 focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-primary/20 focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="border-primary/20 focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-primary/5 rounded-b-lg border-t border-primary/10">
            <Button type="submit" onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Here's how you can reach us directly</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">to@climatesmartcafe.edu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">The Oxford</p>
                  <p className="text-muted-foreground">Open(Monday-Friday): 7am-8pm</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5 rounded-t-lg border-b border-primary/10">
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-medium">How can I participate in sustainability initiatives?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our dashboard page to see current initiatives and ways to get involved.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Do you offer vegetarian and vegan options?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We have a wide variety of plant-based options available daily.
                </p>
              </div>

              <div>
                <h3 className="font-medium">How do you calculate carbon footprint?</h3>
                <p className="text-sm text-muted-foreground">
                  We use a comprehensive lifecycle assessment that includes production, transportation, and preparation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
