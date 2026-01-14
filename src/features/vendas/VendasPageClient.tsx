"use client"

import { useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { PageHeader, ConfirmDialog, CurrencyTextField } from "@/shared/components"
import {
  useVendas,
  useDeleteVenda,
  useSetores,
} from "@/shared/hooks"
import { formatCurrency } from "@/shared/utils/format"
import type { Venda } from "@/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function VendasPageClient() {
  const router = useRouter()
  const [filters, setFilters] = useState<{
    setor_slug?: string
    numero?: string
  }>({})
  const [vendaToDelete, setVendaToDelete] = useState<Venda | null>(null)

  const { data: setores } = useSetores()
  const { data: vendas, isLoading, error } = useVendas(filters)
  const deleteVenda = useDeleteVenda()

  const handleDelete = async () => {
    if (!vendaToDelete) return
    try {
      await deleteVenda.mutateAsync(vendaToDelete.id)
      setVendaToDelete(null)
    } catch (error) {
      console.error("Erro ao deletar venda:", error)
    }
  }

  // Calcular estatísticas
  const totalVendas = vendas?.length || 0
  const valorTotal = vendas?.reduce((sum, v) => sum + (v.valor_total_venda || 0), 0) || 0

  return (
    <Box>
      <PageHeader
        title="Vendas"
        subtitle="Gerenciamento de vendas de lotes"
        action={
          <Button
            component={Link}
            href="/vendas/nova"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nova Venda
          </Button>
        }
      />

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Setor</InputLabel>
                <Select
                  value={filters.setor_slug || ""}
                  label="Setor"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      setor_slug: e.target.value || undefined,
                    })
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  {setores?.map((setor) => (
                    <MenuItem key={setor.id} value={setor.slug}>
                      {setor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Número do Lote"
                value={filters.numero || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    numero: e.target.value || undefined,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({})}
                disabled={!filters.setor_slug && !filters.numero}
              >
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total de Vendas
              </Typography>
              <Typography variant="h4">{totalVendas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Valor Total Vendido
              </Typography>
              <Typography variant="h4">{formatCurrency(valorTotal)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Vendas */}
      {error ? (
        <Alert severity="error">Erro ao carregar vendas. Tente novamente mais tarde.</Alert>
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : !vendas || vendas.length === 0 ? (
        <Alert severity="info">Nenhuma venda encontrada.</Alert>
      ) : (
        <Card>
          <CardContent>
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <th style={{ textAlign: "left", padding: "12px" }}>Lote</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Setor</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Comprador</th>
                    <th style={{ textAlign: "right", padding: "12px" }}>Valor Total</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>Forma Pagamento</th>
                    <th style={{ textAlign: "right", padding: "12px" }}>Entrada</th>
                    <th style={{ textAlign: "center", padding: "12px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px" }}>
                        <Typography fontWeight="medium">{venda.numero}</Typography>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {venda.setor?.nome || "-"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {venda.comprador || "-"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {venda.valor_total_venda ? formatCurrency(venda.valor_total_venda) : "-"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {venda.forma_pagamento || "-"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {venda.entrada_venda ? formatCurrency(venda.entrada_venda) : "-"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Ver Detalhes">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/vendas/${venda.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/vendas/${venda.id}/editar`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar Venda">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setVendaToDelete(venda)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!vendaToDelete}
        title="Cancelar Venda"
        message={`Tem certeza que deseja cancelar a venda do lote ${vendaToDelete?.numero}? O lote voltará a ficar disponível. Esta ação não pode ser desfeita.`}
        confirmLabel="Cancelar Venda"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setVendaToDelete(null)}
        loading={deleteVenda.isPending}
      />
    </Box>
  )
}
