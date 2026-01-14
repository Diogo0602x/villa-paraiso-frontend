import { Box, Typography, Alert } from "@mui/material"
import { PageHeader } from "@/shared/components"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Detalhes do Cliente | Villa Paraíso",
  description: "Informações detalhadas do cliente",
}

interface Props {
  params: Promise<{ nome: string }>
}

export default async function ClienteDetailPage({ params }: Props) {
  const { nome } = await params
  return (
    <Box>
      <PageHeader title={decodeURIComponent(nome)} subtitle="Detalhes do cliente" />
      <Alert severity="info" sx={{ mt: 3 }}>
        O módulo de clientes não está disponível na API atual. Esta funcionalidade será implementada
        quando os endpoints de clientes estiverem disponíveis.
      </Alert>
    </Box>
  )
}
