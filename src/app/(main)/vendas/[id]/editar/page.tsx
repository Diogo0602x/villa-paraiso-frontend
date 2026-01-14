import { VendaEditPageClient } from "@/features/vendas/VendaEditPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Editar Venda | Villa Paraíso",
  description: "Editar venda de lote",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <VendaEditPageClient vendaId={id} />
}
