"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, CalendarIcon, ShoppingCartIcon, Settings, Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavProps {
  children?: React.ReactNode
}

export function MobileNav({ children }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white dark:bg-black text-black dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6">
          {children}
          
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Link>
          
          <Link
            href="/dashboard/events"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <CalendarIcon className="mr-3 h-5 w-5" />
            Events
          </Link>
          
          <Link
            href="/dashboard/purchases"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <ShoppingCartIcon className="mr-3 h-5 w-5" />
            Purchases
          </Link>
          
          <Link
            href="/dashboard/organization/members"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Users className="mr-3 h-5 w-5" />
            Team
          </Link>
          
          <Link
            href="/dashboard/organization/email-templates"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Mail className="mr-3 h-5 w-5" />
            Email Templates
          </Link>
          
          <Link
            href="/dashboard/organization/general"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

