import { VendaDetailPageClient } from "@/features/vendas/VendaDetailPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Detalhes da Venda | Villa Paraíso",
  description: "Visualizar detalhes da venda",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <VendaDetailPageClient vendaId={id} />
}
