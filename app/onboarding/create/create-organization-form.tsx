"use client"

import { useState } from "react"
import { useActionState } from "react"
import Link from "next/link"
import { CalendarIcon, BuildingIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"
import { createOrganization } from "./actions"

export function CreateOrganizationForm() {
  const [state, formAction] = useActionState(createOrganization, { error: "" })

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="organization_name">Organization Name</Label>
        <Input
          id="organization_name"
          name="organization_name"
          placeholder="Acme Corporation"
          required
        />
        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
      </div>
      <SubmitButton className="w-full">
        <BuildingIcon className="mr-2 h-4 w-4" />
        Create Organization
      </SubmitButton>
    </form>
  )
}
