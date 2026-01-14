import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Recebíveis | Villa Paraíso",
  description: "Gerenciamento de parcelas a receber",
}

export default function RecebiveisPage() {
  return (
    <Box>
      <PageHeader title="Recebíveis" subtitle="Gerenciamento de parcelas a receber" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de recebíveis não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de recebíveis estiverem disponíveis.
      </Alert>
    </Box>
  )
}
