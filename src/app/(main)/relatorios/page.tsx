import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Relatórios | Villa Paraíso",
  description: "Relatórios e análises",
}

export default function RelatoriosPage() {
  return (
    <Box>
      <PageHeader title="Relatórios" subtitle="Análises e relatórios do sistema" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de relatórios não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de relatórios estiverem disponíveis.
      </Alert>
    </Box>
  )
}
