import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pagamentos | Villa Paraíso",
  description: "Histórico de pagamentos realizados",
}

export default function PagamentosPage() {
  return (
    <Box>
      <PageHeader title="Pagamentos" subtitle="Histórico de pagamentos realizados" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de pagamentos não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de pagamentos estiverem disponíveis.
      </Alert>
    </Box>
  )
}
