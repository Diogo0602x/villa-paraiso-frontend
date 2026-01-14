"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PaymentIcon from "@mui/icons-material/Payment"
import Link from "next/link"
import { formatCurrency } from "@/shared/utils/format"
import { formatDate, calcularDiasAtraso } from "@/lib/date"
import { StatusChip, LoadingState, ErrorState, ConfirmDialog } from "@/shared/components"
import { useVenda, useDeleteVenda } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { useRouter } from "next/navigation"
import { StatusParcela } from "@/enums"
import type { Parcela } from "@/types"
import { RegistrarPagamentoModal } from "./RegistrarPagamentoModal"
import { PermutaSection } from "./PermutaSection"

interface VendaDetailsProps {
  vendaId: number
}

export function VendaDetails({ vendaId }: VendaDetailsProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { data: venda, isLoading, error, refetch } = useVenda(vendaId)
  const deleteVenda = useDeleteVenda()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false)
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null)

  if (isLoading) return <LoadingState message="Carregando detalhes da venda..." />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!venda) return <ErrorState error={new Error("Venda não encontrada")} />

  // Calculate totals
  const totalPago =
    venda.parcelas?.reduce((acc, parcela) => {
      const pagamentos = parcela.pagamentos || []
      return acc + pagamentos.reduce((sum, p) => sum + p.valor, 0)
    }, 0) || 0

  const totalPendente = venda.valorTotal - venda.valorEntrada - totalPago

  const handleDelete = async () => {
    try {
      await deleteVenda.mutateAsync(vendaId)
      showSuccess("Venda excluída com sucesso")
      router.push("/vendas")
    } catch {
      showError("Erro ao excluir venda")
    }
    setDeleteDialogOpen(false)
  }

  const handleOpenPagamentoModal = (parcela: Parcela) => {
    setSelectedParcela(parcela)
    setPagamentoModalOpen(true)
  }

  return (
    <Box>
      {/* Header Actions */}
      <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
        <Button component={Link} href={`/vendas/${vendaId}/editar`} variant="outlined" startIcon={<EditIcon />}>
          Editar
        </Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialogOpen(true)}>
          Excluir
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Valor Total
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {formatCurrency(venda.valorTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Entrada
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {formatCurrency(venda.valorEntrada)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Pago
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {formatCurrency(totalPago + venda.valorEntrada)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pendente
              </Typography>
              <Typography variant="h5" fontWeight={600} color="warning.main">
                {formatCurrency(totalPendente)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Lote Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Dados do Lote
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Número
                </Typography>
                <Typography variant="body1">{venda.lote?.numero || "-"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Setor
                </Typography>
                <Typography variant="body1">{venda.lote?.setor?.nome || "-"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Área
                </Typography>
                <Typography variant="body1">{venda.lote?.area ? `${venda.lote.area} m²` : "-"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                {venda.lote && <StatusChip status={venda.lote.status} type="lote" />}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Buyer Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Dados do Comprador
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1">{venda.compradorNome}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  CPF
                </Typography>
                <Typography variant="body1">{venda.compradorCpf || "-"}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Telefone
                </Typography>
                <Typography variant="body1">{venda.compradorTelefone || "-"}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{venda.compradorEmail || "-"}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sale Info */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dados da Venda
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Data da Venda
                </Typography>
                <Typography variant="body1">{formatDate(venda.dataVenda)}</Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Parcelas
                </Typography>
                <Typography variant="body1">
                  {venda.quantidadeParcelas}x de {formatCurrency(venda.valorParcela)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Observações
                </Typography>
                <Typography variant="body1">{venda.observacoes || "-"}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Permuta Section */}
        <Grid size={12}>
          <PermutaSection vendaId={vendaId} observacoes={venda.observacoes || ""} />
        </Grid>

        {/* Parcelas Table */}
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parcelas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Parcela</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Pago</TableCell>
                    <TableCell>Dias Atraso</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venda.parcelas?.map((parcela) => {
                    const totalPagoParcela = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
                    const diasAtraso =
                      parcela.status === StatusParcela.ATRASADO ? calcularDiasAtraso(parcela.dataVencimento) : 0

                    return (
                      <TableRow key={parcela.id} hover>
                        <TableCell>{parcela.numeroParcela}</TableCell>
                        <TableCell align="right">{formatCurrency(parcela.valor)}</TableCell>
                        <TableCell>{formatDate(parcela.dataVencimento)}</TableCell>
                        <TableCell>
                          <StatusChip status={parcela.status} type="parcela" />
                        </TableCell>
                        <TableCell align="right">{formatCurrency(totalPagoParcela)}</TableCell>
                        <TableCell>
                          {diasAtraso > 0 ? <Chip label={`${diasAtraso} dias`} size="small" color="error" /> : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {parcela.status !== StatusParcela.PAGO && (
                            <Tooltip title="Registrar Pagamento">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenPagamentoModal(parcela)}
                              >
                                <PaymentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Venda"
        message="Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deleteVenda.isPending}
      />

      {/* Pagamento Modal */}
      {selectedParcela && (
        <RegistrarPagamentoModal
          open={pagamentoModalOpen}
          parcela={selectedParcela}
          onClose={() => {
            setPagamentoModalOpen(false)
            setSelectedParcela(null)
          }}
          onSuccess={() => {
            refetch()
            setPagamentoModalOpen(false)
            setSelectedParcela(null)
          }}
        />
      )}
    </Box>
  )
}
