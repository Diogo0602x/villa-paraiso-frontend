"use client"

import { Box, Grid } from "@mui/material"
import LandscapeIcon from "@mui/icons-material/Landscape"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import { PageHeader } from "@/shared/components"
import { useResumoGeral, useResumoDividas, useResumoLotesStatus } from "@/hooks"
import { formatCurrency } from "@/shared/utils/format"
import { KpiCard, LotesStatusChart, DividasResumo } from "./components"

export function DashboardPage() {
  const { data: resumoGeral, isLoading: loadingResumo } = useResumoGeral()
  const { data: resumoDividas, isLoading: loadingDividas } = useResumoDividas()
  const { data: resumoLotes, isLoading: loadingLotes } = useResumoLotesStatus()

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Visão geral do sistema Villa Paraíso" />

      <Grid container spacing={3}>
        {/* KPI Cards - Lotes */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Total de Lotes"
            value={resumoGeral?.lotes.total ?? 0}
            subtitle={`${resumoGeral?.lotes.disponiveis ?? 0} disponíveis`}
            icon={<LandscapeIcon />}
            color="primary.main"
            loading={loadingResumo}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Lotes Vendidos"
            value={resumoGeral?.lotes.vendidos ?? 0}
            subtitle={`${resumoGeral?.lotes.percentual_vendido.toFixed(1) ?? 0}% do total`}
            icon={<AttachMoneyIcon />}
            color="success.main"
            loading={loadingResumo}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Total de Setores"
            value={resumoGeral?.setores.total ?? 0}
            subtitle="Setores cadastrados"
            icon={<LandscapeIcon />}
            color="info.main"
            loading={loadingResumo}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            title="Dívidas Totais"
            value={formatCurrency(resumoGeral?.dividas.valor_total ?? 0)}
            subtitle={`${resumoGeral?.dividas.total_dividas ?? 0} dívidas`}
            icon={<AccountBalanceIcon />}
            color="error.main"
            loading={loadingResumo}
          />
        </Grid>

        {/* Charts Row */}
        <Grid size={{ xs: 12, md: 6 }}>
          <LotesStatusChart data={resumoLotes} loading={loadingLotes} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DividasResumo data={resumoDividas} loading={loadingDividas} />
        </Grid>

        {/* Resumo Financeiro Dívidas */}
        {resumoDividas && (
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Valor Pago"
              value={formatCurrency(resumoDividas.valor_pago)}
              subtitle={`${resumoDividas.percentual_pago.toFixed(1)}% do total`}
              icon={<AttachMoneyIcon />}
              color="success.main"
              loading={loadingDividas}
            />
          </Grid>
        )}
        {resumoDividas && (
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Valor a Pagar"
              value={formatCurrency(resumoDividas.valor_a_pagar)}
              subtitle="Pendente"
              icon={<PendingActionsIcon />}
              color="warning.main"
              loading={loadingDividas}
            />
          </Grid>
        )}
        {resumoGeral && (
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              title="Lotes com Água"
              value={resumoGeral.lotes.com_agua}
              subtitle={`${((resumoGeral.lotes.com_agua / resumoGeral.lotes.total) * 100).toFixed(1)}% do total`}
              icon={<LandscapeIcon />}
              color="info.main"
              loading={loadingResumo}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
