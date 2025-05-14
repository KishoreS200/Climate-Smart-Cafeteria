import { Leaf, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 bg-primary/5">
      <div className="container flex flex-col items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold">Climate Smart Cafeteria</span>
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="container mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-3 text-sm font-medium">Contact Us</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>to@climatesmartcafe.edu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>(555) 123-4567</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-3 text-sm font-medium">Location</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>The Oxford</span>
          </div>
          <div className="text-sm text-muted-foreground mt-2 text-center md:text-left">Open(Monday-Friday): 7am-8pm</div>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-3 text-sm font-medium">Our Mission</h3>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            To create a sustainable dining experience that reduces food waste and promotes climate-friendly food choices
            across campus.
          </p>
        </div>
      </div>
      <div className="container mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Climate Smart Cafeteria. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
