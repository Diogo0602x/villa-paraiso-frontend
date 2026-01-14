import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Clientes | Villa Paraíso",
  description: "Gerenciamento de clientes",
}

export default function ClientesPage() {
  return (
    <Box>
      <PageHeader title="Clientes" subtitle="Gerenciamento de clientes" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de clientes não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de clientes estiverem disponíveis.
      </Alert>
    </Box>
  )
}
