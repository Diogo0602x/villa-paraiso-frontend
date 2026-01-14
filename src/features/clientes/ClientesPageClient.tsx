"use client"

import { useState } from "react"
import { Box, TextField, InputAdornment, Card, CardContent, Typography, Stack } from "@mui/material"
import { Search } from "@mui/icons-material"
import { useClientes } from "@/hooks/useClientes"
import { PageHeader, LoadingState, ErrorState, EmptyState } from "@/shared/components"
import { ClientesTable } from "./components"
import { formatCurrency } from "@/utils"

export function ClientesPageClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Simple debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // Debounce the actual search
    setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  const { data: clientes, isLoading, error } = useClientes(debouncedSearch || undefined)

  // Calculate totals
  const totalClientes = clientes?.length || 0
  const totalValorPendente = clientes?.reduce((sum, c) => sum + c.valorPendente, 0) || 0
  const totalComAtraso = clientes?.filter((c) => c.parcelasAtrasadas > 0).length || 0

  if (error) {
    return <ErrorState message="Erro ao carregar clientes" onRetry={() => window.location.reload()} />
  }

  return (
    <Box>
      <PageHeader title="Clientes" subtitle="Gerenciamento de clientes e compradores" />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total de Clientes
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {totalClientes}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Valor Pendente Total
              </Typography>
              <Typography variant="h5" fontWeight={600} color="warning.main">
                {formatCurrency(totalValorPendente)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Clientes com Atraso
              </Typography>
              <Typography variant="h5" fontWeight={600} color="error.main">
                {totalComAtraso}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Buscar por nome do cliente..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: "100%", sm: 400 } }}
        />
      </Box>

      {isLoading ? (
        <LoadingState message="Carregando clientes..." />
      ) : !clientes || clientes.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description={
            searchTerm
              ? "Nenhum cliente corresponde à sua busca"
              : "Os clientes aparecerão aqui quando houver vendas registradas"
          }
        />
      ) : (
        <ClientesTable clientes={clientes} />
      )}
    </Box>
  )
}
