"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Card, CardContent, Typography, Stack } from "@mui/material"
import { usePagamentos, useDeletePagamento } from "@/hooks/usePagamentos"
import { PageHeader, LoadingState, ErrorState, EmptyState, ConfirmDialog } from "@/shared/components"
import { PagamentosFilters, PagamentosTable, EditPagamentoModal, type PagamentosFiltersState } from "./components"
import type { Pagamento } from "@/types"
import { formatCurrency } from "@/utils"
import { useToast } from "@/shared/providers"

export function PagamentosPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [filters, setFilters] = useState<PagamentosFiltersState>({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null)

  const deleteMutation = useDeletePagamento()

  // Sync filters with URL
  useEffect(() => {
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

    setFilters({
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
    })
  }, [searchParams])

  const updateUrl = (newFilters: PagamentosFiltersState) => {
    const params = new URLSearchParams()
    if (newFilters.dataInicio) params.set("dataInicio", newFilters.dataInicio)
    if (newFilters.dataFim) params.set("dataFim", newFilters.dataFim)

    const query = params.toString()
    router.push(`/pagamentos${query ? `?${query}` : ""}`)
  }

  const handleFiltersChange = (newFilters: PagamentosFiltersState) => {
    updateUrl(newFilters)
  }

  const { data: pagamentosResponse, isLoading, error } = usePagamentos(filters)
  const pagamentos = pagamentosResponse?.data || []

  const handleEdit = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento)
    setEditModalOpen(true)
  }

  const handleDelete = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPagamento) return

    try {
      await deleteMutation.mutateAsync(selectedPagamento.id)
      showSuccess("Pagamento excluído com sucesso!")
      setDeleteDialogOpen(false)
      setSelectedPagamento(null)
    } catch (error) {
      showError("Erro ao excluir pagamento")
    }
  }

  // Calculate totals
  const totalPagamentos = pagamentos.reduce((sum, p) => sum + p.valor, 0)

  if (error) {
    return <ErrorState message="Erro ao carregar pagamentos" onRetry={() => window.location.reload()} />
  }

  return (
    <Box>
      <PageHeader title="Pagamentos" subtitle="Histórico de pagamentos realizados" />

      <Card sx={{ mb: { xs: 2, md: 3 } }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 4 }}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Total de Pagamentos
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                {pagamentos.length}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Valor Total Recebido
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                color="success.main"
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                {formatCurrency(totalPagamentos)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <PagamentosFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <LoadingState message="Carregando pagamentos..." />
      ) : pagamentos.length === 0 ? (
        <EmptyState
          title="Nenhum pagamento encontrado"
          description="Ajuste os filtros ou registre novos pagamentos nas vendas"
        />
      ) : (
        <PagamentosTable pagamentos={pagamentos} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <EditPagamentoModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedPagamento(null)
        }}
        pagamento={selectedPagamento}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Pagamento"
        message={`Tem certeza que deseja excluir este pagamento de ${selectedPagamento ? formatCurrency(selectedPagamento.valor) : ""}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSelectedPagamento(null)
        }}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  )
}
