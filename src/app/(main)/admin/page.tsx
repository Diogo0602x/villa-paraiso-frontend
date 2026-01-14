import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Administração | Villa Paraíso",
  description: "Configurações e administração do sistema",
}

export default function AdminPage() {
  return (
    <Box>
      <PageHeader title="Administração" subtitle="Configurações e administração do sistema" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de administração não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de administração estiverem disponíveis.
      </Alert>
    </Box>
  )
}
