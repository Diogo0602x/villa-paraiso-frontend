"use client"

import { useState, useCallback } from "react"
import { Box, Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import Link from "next/link"
import { PageHeader, ConfirmDialog } from "@/shared/components"
import { useVendas, useDeleteVenda } from "@/shared/hooks"
import { useToast } from "@/shared/providers"
import { VendasFilters, VendasTable } from "./components"
import type { Venda } from "@/types"
import type { VendasFilters as VendasFiltersType } from "@/services/vendasApi"

export function VendasListPage() {
  const { showSuccess, showError } = useToast()
  const [filters, setFilters] = useState<VendasFiltersType>({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [vendaToDelete, setVendaToDelete] = useState<Venda | null>(null)

  const { data, isLoading, refetch } = useVendas({ ...filters, page, limit })
  const deleteVenda = useDeleteVenda()

  const handleFiltersChange = useCallback((newFilters: VendasFiltersType) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleDelete = async () => {
    if (!vendaToDelete) return
    try {
      await deleteVenda.mutateAsync(vendaToDelete.id)
      showSuccess("Venda excluída com sucesso")
      refetch()
    } catch {
      showError("Erro ao excluir venda")
    }
    setVendaToDelete(null)
  }

  return (
    <Box>
      <PageHeader
        title="Vendas"
        subtitle="Gerenciamento de vendas de lotes"
        action={
          <Button component={Link} href="/vendas/nova" variant="contained" startIcon={<AddIcon />}>
            Nova Venda
          </Button>
        }
      />

      <VendasFilters onFiltersChange={handleFiltersChange} />

      <VendasTable
        data={data?.data}
        meta={data?.meta}
        loading={isLoading}
        page={page}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
        onDelete={setVendaToDelete}
      />

      <ConfirmDialog
        open={!!vendaToDelete}
        title="Excluir Venda"
        message={`Tem certeza que deseja excluir a venda de ${vendaToDelete?.compradorNome}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setVendaToDelete(null)}
        loading={deleteVenda.isPending}
      />
    </Box>
  )
}
