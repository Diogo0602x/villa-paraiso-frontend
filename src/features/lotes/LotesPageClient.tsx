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
  CircularProgress,
  Alert,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Stack,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { PageHeader } from "@/shared/components"
import { useLotes, useResumoLotesStatus } from "@/hooks"
import { useSetores } from "@/shared/hooks"
import { useDeleteLote } from "@/shared/hooks/useLotes"
import { StatusLote, StatusLoteLabels, StatusLoteColors } from "@/enums"
import type { StatusLote as StatusLoteType, Lote } from "@/types"
import { LoteFormModal } from "./components/LoteFormModal"
import { RegistrarVendaModal } from "./components/RegistrarVendaModal"
import { ConfirmDialog } from "@/shared/components/ConfirmDialog"

export function LotesPageClient() {
  const [filters, setFilters] = useState<{
    setor_slug?: string
    status?: StatusLoteType
    tem_acesso_agua?: boolean
    frente_br060?: boolean
    numero?: string
  }>({})

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [vendaModalOpen, setVendaModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null)

  const { data: lotes, isLoading, error } = useLotes(filters)
  const { data: resumo, isLoading: isLoadingResumo } = useResumoLotesStatus()
  const { data: setores } = useSetores()
  const deleteMutation = useDeleteLote()

  const formatArea = (area: number | null) => {
    if (!area) return "-"
    return `${area.toLocaleString("pt-BR")} m²`
  }

  const handleEdit = (lote: Lote) => {
    setSelectedLote(lote)
    setFormModalOpen(true)
  }

  const handleDelete = (lote: Lote) => {
    setSelectedLote(lote)
    setDeleteDialogOpen(true)
  }

  const handleRegistrarVenda = (lote: Lote) => {
    setSelectedLote(lote)
    setVendaModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedLote) {
      try {
        await deleteMutation.mutateAsync(selectedLote.id)
        setDeleteDialogOpen(false)
        setSelectedLote(null)
      } catch (error) {
        console.error("Erro ao deletar lote:", error)
      }
    }
  }

  const handleCloseModals = () => {
    setFormModalOpen(false)
    setVendaModalOpen(false)
    setSelectedLote(null)
  }

  return (
    <Box sx={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
      <PageHeader title="Lotes" subtitle="Gerenciamento de lotes" />

      {/* Resumo */}
      {isLoadingResumo ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : resumo ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {resumo.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Disponíveis
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {resumo.disponiveis}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reservados
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {resumo.reservados}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Vendidos
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {resumo.vendidos}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Indisponíveis
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="text.secondary">
                  {resumo.indisponiveis}
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
                setSelectedLote(null)
                setFormModalOpen(true)
              }}
            >
              Novo Lote
            </Button>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Buscar por Número"
                value={filters.numero || ""}
                onChange={(e) => setFilters({ ...filters, numero: e.target.value || undefined })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ""}
                  label="Status"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: (e.target.value as StatusLoteType) || undefined,
                    })
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(StatusLote).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {StatusLoteLabels[value]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.tem_acesso_agua === true}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setFilters({
                          ...filters,
                          tem_acesso_agua: checked ? true : undefined,
                        })
                      }}
                    />
                  }
                  label="Com Água"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.frente_br060 === true}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setFilters({
                          ...filters,
                          frente_br060: checked ? true : undefined,
                        })
                      }}
                    />
                  }
                  label="BR-060"
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Lotes */}
      {error ? (
        <Alert severity="error">Erro ao carregar lotes. Tente novamente mais tarde.</Alert>
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : lotes && lotes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Setor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Área</TableCell>
                <TableCell align="center">Água</TableCell>
                <TableCell align="center">BR-060</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lotes.map((lote) => (
                <TableRow key={lote.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{lote.numero}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lote.setor?.nome || "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={StatusLoteLabels[lote.status]}
                      size="small"
                      sx={{
                        bgcolor: StatusLoteColors[lote.status],
                        color: "white",
                        fontWeight: "medium",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{formatArea(lote.area)}</TableCell>
                  <TableCell align="center">
                    {lote.tem_acesso_agua ? (
                      <Chip label="Sim" size="small" color="success" />
                    ) : (
                      <Chip label="Não" size="small" color="default" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {lote.frente_br060 ? (
                      <Chip label="Sim" size="small" color="info" />
                    ) : (
                      <Chip label="Não" size="small" color="default" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleEdit(lote)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {lote.status !== StatusLote.VENDIDO && (
                        <Tooltip title="Registrar Venda">
                          <IconButton size="small" onClick={() => handleRegistrarVenda(lote)} color="success">
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Deletar">
                        <IconButton size="small" onClick={() => handleDelete(lote)} color="error">
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
        <Alert severity="info">Nenhum lote encontrado com os filtros selecionados.</Alert>
      )}

      {/* Modais */}
      <LoteFormModal open={formModalOpen} onClose={handleCloseModals} lote={selectedLote} />
      <RegistrarVendaModal open={vendaModalOpen} onClose={handleCloseModals} lote={selectedLote} />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o lote ${selectedLote?.numero}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSelectedLote(null)
        }}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
