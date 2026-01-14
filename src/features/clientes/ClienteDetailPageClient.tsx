"use client"

import { Box, Button, Stack } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useClienteByName } from "@/hooks/useClientes"
import { PageHeader, LoadingState, ErrorState } from "@/shared/components"
import { ClienteInfoCard, ClienteVendasList } from "./components"

interface ClienteDetailPageClientProps {
  nome: string
}

export function ClienteDetailPageClient({ nome }: ClienteDetailPageClientProps) {
  const router = useRouter()
  const decodedNome = decodeURIComponent(nome)
  const { data: cliente, isLoading, error } = useClienteByName(decodedNome)

  if (isLoading) {
    return <LoadingState message="Carregando dados do cliente..." />
  }

  if (error || !cliente) {
    return <ErrorState message="Cliente não encontrado" onRetry={() => router.push("/clientes")} />
  }

  return (
    <Box>
      <PageHeader
        title={cliente.nome}
        subtitle="Detalhes do cliente"
        action={
          <Button startIcon={<ArrowBack />} onClick={() => router.push("/clientes")}>
            Voltar
          </Button>
        }
      />

      <Stack spacing={3}>
        <ClienteInfoCard cliente={cliente} />
        {cliente.vendas && <ClienteVendasList vendas={cliente.vendas} />}
      </Stack>
    </Box>
  )
}
