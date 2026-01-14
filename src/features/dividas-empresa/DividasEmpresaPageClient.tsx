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
    <Box sx={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
      <PageHeader title="Dívidas da Empresa" subtitle="Controle de dívidas e obrigações" />

      {/* Resumo Financeiro */}
      {isLoadingResumo ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : resumo ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valor Total
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {formatCurrency(resumo.valor_total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valor Pago
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrency(resumo.valor_pago)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valor a Pagar
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {formatCurrency(resumo.valor_a_pagar)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  % Pago
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {resumo.percentual_pago?.toFixed(1) ?? "0.0"}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      {/* Filtros Avançados */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Filtros
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedDivida(null)
                setFormModalOpen(true)
              }}
            >
              Nova Dívida
            </Button>
          </Stack>

          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Todas" value="all" />
            <Tab label="Pagas" value="pagas" />
            <Tab label="Não Pagas" value="nao-pagas" />
            <Tab label="Pendentes" value="pendentes" />
          </Tabs>

          <Grid container spacing={2}>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Credor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell align="right">Valor Pago</TableCell>
                <TableCell align="right">Valor a Pagar</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data Pagamento</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDividas.data.map((divida) => (
                <TableRow key={divida.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{divida.credor}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {divida.descricao}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">{formatCurrency(divida.valor_total)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="success.main">{formatCurrency(divida.valor_pago)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="warning.main" fontWeight="medium">
                      {formatCurrency(divida.valor_total - divida.valor_pago)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={StatusDividaEmpresaLabels[divida.status]}
                      size="small"
                      sx={{
                        bgcolor: StatusDividaEmpresaColors[divida.status],
                        color: "white",
                        fontWeight: "medium",
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(divida.data_pagamento)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(divida)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton size="small" onClick={() => handleDelete(divida)} color="error">
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
