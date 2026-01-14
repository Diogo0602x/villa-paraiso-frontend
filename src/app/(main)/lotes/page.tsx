import { LotesPageClient } from "@/features/lotes/LotesPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Lotes | Villa Paraíso",
  description: "Gerenciamento de lotes",
}

export default function LotesPage() {
  return <LotesPageClient />
}
