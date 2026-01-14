"use client"

import { useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { PageHeader, CurrencyTextField } from "@/shared/components"
import {
  useDividas,
  useResumoDividas,
  useDividasPagas,
  useDividasNaoPagas,
  useDividasPendentes,
  useDividasPorValor,
  useDeleteDivida,
} from "@/hooks/useDividas"
import { StatusDividaEmpresa, StatusDividaEmpresaLabels, StatusDividaEmpresaColors } from "@/enums"
import type { StatusDividaEmpresa as StatusDividaEmpresaType, DividaEmpresa } from "@/types"
import { formatCurrency } from "@/shared/utils/format"
import { DividaFormModal } from "./components/DividaFormModal"
import { ConfirmDialog } from "@/shared/components/ConfirmDialog"

type FilterTab = "all" | "pagas" | "nao-pagas" | "pendentes"

export function DividasEmpresaPageClient() {
  const [filters, setFilters] = useState<{
    status?: StatusDividaEmpresaType
    credor?: string
  }>({})

  const [valorFilters, setValorFilters] = useState<{
    valor_minimo?: number
    valor_maximo?: number
    credor?: string
    status?: StatusDividaEmpresaType
  }>({})

  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDivida, setSelectedDivida] = useState<DividaEmpresa | null>(null)

  // Determinar qual query usar baseado na tab ativa e filtros de valor
  const useValorFilter = activeTab === "all" && (valorFilters.valor_minimo || valorFilters.valor_maximo)

  const { data: dividas, isLoading } = useDividas(activeTab === "all" && !useValorFilter ? filters : undefined)

  const { data: dividasPagas, isLoading: isLoadingPagas } = useDividasPagas(
    { credor: filters.credor },
    activeTab === "pagas",
  )
  const { data: dividasNaoPagas, isLoading: isLoadingNaoPagas } = useDividasNaoPagas(
    { credor: filters.credor },
    activeTab === "nao-pagas",
  )
  const { data: dividasPendentes, isLoading: isLoadingPendentes } = useDividasPendentes(
    { credor: filters.credor },
    activeTab === "pendentes",
  )
  const { data: dividasPorValor, isLoading: isLoadingPorValor } = useDividasPorValor(
    useValorFilter ? { ...valorFilters, credor: filters.credor, status: filters.status } : undefined,
    useValorFilter,
  )

  const { data: resumo, isLoading: isLoadingResumo } = useResumoDividas()
  const deleteMutation = useDeleteDivida()

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getCurrentDividas = () => {
    if (useValorFilter) {
      return { data: dividasPorValor, isLoading: isLoadingPorValor }
    }

    switch (activeTab) {
      case "pagas":
        return { data: dividasPagas, isLoading: isLoadingPagas }
      case "nao-pagas":
        return { data: dividasNaoPagas, isLoading: isLoadingNaoPagas }
      case "pendentes":
        return { data: dividasPendentes, isLoading: isLoadingPendentes }
      default:
        return { data: dividas, isLoading }
    }
  }

  const currentDividas = getCurrentDividas()

  const handleEdit = (divida: DividaEmpresa) => {
    setSelectedDivida(divida)
    setFormModalOpen(true)
  }

  const handleDelete = (divida: DividaEmpresa) => {
    setSelectedDivida(divida)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedDivida) {
      try {
        await deleteMutation.mutateAsync(selectedDivida.id)
        setDeleteDialogOpen(false)
        setSelectedDivida(null)
      } catch (error) {
        console.error("Erro ao deletar dívida:", error)
      }
    }
  }

  const handleCloseModal = () => {
    setFormModalOpen(false)
    setSelectedDivida(null)
  }

  return (
    <Box sx={{ minHeight: { xs: "auto", md: "calc(100vh - 140px)" }, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Dívidas da Empresa" subtitle="Controle de dívidas e obrigações" />

      {/* Resumo Financeiro */}
      {isLoadingResumo ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : resumo ? (
        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ mb: { xs: 2, md: 3 } }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Valor Total
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="error.main"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {formatCurrency(resumo.valor_total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Valor Pago
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="success.main"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {formatCurrency(resumo.valor_pago)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Valor a Pagar
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="warning.main"
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  {formatCurrency(resumo.valor_a_pagar)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  % Pago
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  {resumo.percentual_pago?.toFixed(1) ?? "0.0"}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Filtros Avançados */}
      <Card sx={{ mb: { xs: 2, md: 3 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              Filtros
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedDivida(null)
                setFormModalOpen(true)
              }}
              fullWidth={{ xs: true, sm: false }}
              sx={{ minHeight: { xs: 44, sm: 36 } }}
            >
              Nova Dívida
            </Button>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Todas" value="all" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
            <Tab label="Pagas" value="pagas" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
            <Tab label="Não Pagas" value="nao-pagas" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
            <Tab label="Pendentes" value="pendentes" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} />
          </Tabs>

          <Grid container spacing={{ xs: 1.5, md: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Buscar por Credor"
                value={filters.credor || ""}
                onChange={(e) => setFilters({ ...filters, credor: e.target.value || undefined })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Status"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: (e.target.value as StatusDividaEmpresaType) || undefined,
                    })
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(StatusDividaEmpresa).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {StatusDividaEmpresaLabels[value]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {activeTab === "all" && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CurrencyTextField
                    fullWidth
                    label="Valor Mínimo"
                    value={valorFilters.valor_minimo || 0}
                    onChange={(value) =>
                      setValorFilters({
                        ...valorFilters,
                        valor_minimo: value > 0 ? value : undefined,
                      })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CurrencyTextField
                    fullWidth
                    label="Valor Máximo"
                    value={valorFilters.valor_maximo || 0}
                    onChange={(value) =>
                      setValorFilters({
                        ...valorFilters,
                        valor_maximo: value > 0 ? value : undefined,
                      })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      // Limpar filtros de valor
                      setValorFilters({})
                    }}
                    disabled={!valorFilters.valor_minimo && !valorFilters.valor_maximo}
                  >
                    Limpar Filtro de Valor
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Dívidas */}
      {currentDividas.isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : currentDividas.data && currentDividas.data.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
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
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Credor</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Descrição</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor Total</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor Pago</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor a Pagar</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Data Pagamento</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDividas.data.map((divida) => (
                <TableRow key={divida.id} hover>
                  <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Typography fontWeight="medium">{divida.credor}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Typography variant="body2" color="text.secondary">
                      {divida.descricao}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Typography fontWeight="medium">{formatCurrency(divida.valor_total)}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Typography color="success.main">{formatCurrency(divida.valor_pago)}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Typography color="warning.main" fontWeight="medium">
                      {formatCurrency(divida.valor_total - divida.valor_pago)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Chip
                      label={StatusDividaEmpresaLabels[divida.status]}
                      size="small"
                      sx={{
                        bgcolor: StatusDividaEmpresaColors[divida.status],
                        color: "white",
                        fontWeight: "medium",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    {formatDate(divida.data_pagamento)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(divida)}
                          color="primary"
                          sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(divida)}
                          color="error"
                          sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">Nenhuma dívida encontrada com os filtros selecionados.</Alert>
      )}

      {/* Modais */}
      <DividaFormModal open={formModalOpen} onClose={handleCloseModal} divida={selectedDivida} />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a dívida de ${selectedDivida?.credor}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSelectedDivida(null)
        }}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
