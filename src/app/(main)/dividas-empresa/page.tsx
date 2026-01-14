import { DividasEmpresaPageClient } from "@/features/dividas-empresa/DividasEmpresaPageClient"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dívidas da Empresa | Villa Paraíso",
  description: "Gerenciamento de dívidas da empresa",
}

export default function DividasEmpresaPage() {
  return <DividasEmpresaPageClient />
}
