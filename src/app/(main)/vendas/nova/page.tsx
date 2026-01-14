import { NovaVendaPageClient } from "@/features/vendas/NovaVendaPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Nova Venda | Villa Paraíso",
  description: "Cadastrar uma nova venda de lote",
}

export default function Page() {
  return <NovaVendaPageClient />
}
