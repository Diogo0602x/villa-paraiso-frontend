import { VendasPageClient } from "@/features/vendas/VendasPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Vendas | Villa Paraíso",
  description: "Gerenciamento de vendas de lotes",
}

export default function VendasPage() {
  return <VendasPageClient />
}
