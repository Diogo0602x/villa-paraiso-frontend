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
      <Card sx={{ mb: { xs: 2, md: 3 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 1.5, md: 2 }}>
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
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Typography color="text.secondary" variant="body2" gutterBottom sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Total de Vendas
              </Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>{totalVendas}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Typography color="text.secondary" variant="body2" gutterBottom sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Valor Total Vendido
              </Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>{formatCurrency(valorTotal)}</Typography>
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
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box
              sx={{
                overflowX: "auto",
                overflowY: "visible",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: 4,
                },
              }}
            >
              <Box component="table" sx={{ width: "100%", minWidth: 800, borderCollapse: "collapse" }}>
                <Box component="thead">
                  <Box component="tr" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box
                      component="th"
                      sx={{ textAlign: "left", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Lote
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "left", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Setor
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "left", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Comprador
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "right", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Valor Total
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "left", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Forma Pagamento
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "right", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Entrada
                    </Box>
                    <Box
                      component="th"
                      sx={{ textAlign: "center", padding: { xs: "8px", sm: "12px" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Ações
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {vendas.map((venda) => (
                    <Box
                      key={venda.id}
                      component="tr"
                      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                    >
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" } }}>
                        <Typography fontWeight="medium" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.numero}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" } }}>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.setor?.nome || "-"}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" } }}>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.comprador || "-"}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" }, textAlign: "right" }}>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.valor_total_venda ? formatCurrency(venda.valor_total_venda) : "-"}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" } }}>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.forma_pagamento || "-"}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" }, textAlign: "right" }}>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          {venda.entrada_venda ? formatCurrency(venda.entrada_venda) : "-"}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ padding: { xs: "8px", sm: "12px" }, textAlign: "center" }}>
                        <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                          <Tooltip title="Ver Detalhes">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/vendas/${venda.id}`)}
                              sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/vendas/${venda.id}/editar`)}
                              sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar Venda">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setVendaToDelete(venda)}
                              sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
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
