"use client"

import { Box } from "@mui/material"
import { PageHeader } from "@/shared/components"
import { VendaEditForm } from "./components"

interface VendaEditPageProps {
  vendaId: number
}

export function VendaEditPage({ vendaId }: VendaEditPageProps) {
  return (
    <Box>
      <PageHeader
        title="Editar Venda"
        breadcrumbs={[
          { label: "Vendas", href: "/vendas" },
          { label: "Detalhes", href: `/vendas/${vendaId}` },
          { label: "Editar" },
        ]}
      />

      <VendaEditForm vendaId={vendaId} />
    </Box>
  )
}
