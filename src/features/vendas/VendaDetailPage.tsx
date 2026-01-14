"use client"

import { Box } from "@mui/material"
import { PageHeader } from "@/shared/components"
import { VendaDetails } from "./components"

interface VendaDetailPageProps {
  vendaId: number
}

export function VendaDetailPage({ vendaId }: VendaDetailPageProps) {
  return (
    <Box>
      <PageHeader
        title="Detalhes da Venda"
        breadcrumbs={[{ label: "Vendas", href: "/vendas" }, { label: "Detalhes" }]}
      />

      <VendaDetails vendaId={vendaId} />
    </Box>
  )
}
