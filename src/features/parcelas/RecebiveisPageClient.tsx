"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Tabs, Tab, Paper } from "@mui/material"
import { useParcelas } from "@/hooks/useParcelas"
import { PageHeader, LoadingState, ErrorState, EmptyState } from "@/shared/components"
import {
  ParcelasFilters,
  ParcelasTable,
  EditParcelaModal,
  RegistrarPagamentoParcelaModal,
  type ParcelasFiltersState,
} from "./components"
import type { Parcela } from "@/types"
import { StatusParcela } from "@/enums"

export function RecebiveisPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [page, setPage] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [filters, setFilters] = useState<ParcelasFiltersState>({})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null)

  // Sync filters with URL
  useEffect(() => {
    const status = searchParams.get("status") as StatusParcela | null
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")
    const pageParam = searchParams.get("page")

    setFilters({
      status: status || undefined,
      dataVencimentoInicio: dataInicio || undefined,
      dataVencimentoFim: dataFim || undefined,
    })
    setPage(pageParam ? Number.parseInt(pageParam) : 0)

    // Set tab based on status
    if (status === StatusParcela.PENDENTE) setTabValue(1)
    else if (status === StatusParcela.PARCIAL) setTabValue(2)
    else if (status === StatusParcela.PAGA) setTabValue(3)
    else setTabValue(0)
  }, [searchParams])

  const updateUrl = (newFilters: ParcelasFiltersState, newPage: number) => {
    const params = new URLSearchParams()
    if (newFilters.status) params.set("status", newFilters.status)
    if (newFilters.dataVencimentoInicio) params.set("dataInicio", newFilters.dataVencimentoInicio)
    if (newFilters.dataVencimentoFim) params.set("dataFim", newFilters.dataVencimentoFim)
    if (newPage > 0) params.set("page", String(newPage))

    const query = params.toString()
    router.push(`/recebiveis${query ? `?${query}` : ""}`)
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    let status: StatusParcela | undefined
    if (newValue === 1) status = StatusParcela.PENDENTE
    else if (newValue === 2) status = StatusParcela.PARCIAL
    else if (newValue === 3) status = StatusParcela.PAGA

    const newFilters = { ...filters, status }
    setTabValue(newValue)
    updateUrl(newFilters, 0)
  }

  const handleFiltersChange = (newFilters: ParcelasFiltersState) => {
    updateUrl(newFilters, 0)
  }

  const handlePageChange = (newPage: number) => {
    updateUrl(filters, newPage)
  }

  const { data, isLoading, error } = useParcelas({
    ...filters,
    page: page + 1,
    limit: 20,
  })

  const handleRegisterPayment = (parcela: Parcela) => {
    setSelectedParcela(parcela)
    setPaymentModalOpen(true)
  }

  const handleEditParcela = (parcela: Parcela) => {
    setSelectedParcela(parcela)
    setEditModalOpen(true)
  }

  if (error) {
    return <ErrorState message="Erro ao carregar parcelas" onRetry={() => window.location.reload()} />
  }

  return (
    <Box>
      <PageHeader title="Recebíveis" subtitle="Parcelas e valores a receber" />

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Todas" />
          <Tab label="Pendentes" />
          <Tab label="Parciais" />
          <Tab label="Pagas" />
        </Tabs>
      </Paper>

      <ParcelasFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <LoadingState message="Carregando parcelas..." />
      ) : !data || data.data.length === 0 ? (
        <EmptyState title="Nenhuma parcela encontrada" description="Ajuste os filtros para ver mais resultados" />
      ) : (
        <ParcelasTable
          parcelas={data.data}
          meta={data.meta}
          page={page}
          onPageChange={handlePageChange}
          onRegisterPayment={handleRegisterPayment}
          onEditParcela={handleEditParcela}
        />
      )}

      <EditParcelaModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedParcela(null)
        }}
        parcela={selectedParcela}
      />

      <RegistrarPagamentoParcelaModal
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setSelectedParcela(null)
        }}
        parcela={selectedParcela}
      />
    </Box>
  )
}
