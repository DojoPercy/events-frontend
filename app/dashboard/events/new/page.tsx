"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateEventPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/events/create')
  }, [router])

  return null
}
