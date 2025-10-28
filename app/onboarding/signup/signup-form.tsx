"use client"

import { useState } from "react"
import Link from "next/link"
import { MailIcon, CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to Auth0 signup with email pre-filled
    const authParams = new URLSearchParams({
      screen_hint: "signup",
      login_hint: email,
    })
    window.location.href = `/auth/login?${authParams.toString()}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <MailIcon className="mr-2 h-4 w-4" />
        Sign Up with Email
      </Button>
    </form>
  )
}

