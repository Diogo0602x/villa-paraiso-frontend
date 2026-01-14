"use client"

import { Card, CardContent, Typography, Box, Skeleton, Divider, LinearProgress } from "@mui/material"
import { formatCurrency } from "@/shared/utils/format"
import type { ResumoDividas } from "@/types"

interface DividasResumoProps {
  data?: ResumoDividas
  loading?: boolean
}

export function DividasResumo({ data, loading = false }: DividasResumoProps) {
  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={120} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumo de Dívidas
        </Typography>

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Valor Total
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatCurrency(data.valor_total)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {data.total_dividas} dívida(s)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Valor Pago
            </Typography>
            <Typography variant="body2" fontWeight={500} color="success.main">
              {formatCurrency(data.valor_pago)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {data.dividas_pagas} dívida(s) paga(s)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Valor a Pagar
            </Typography>
            <Typography variant="body2" fontWeight={500} color="warning.main">
              {formatCurrency(data.valor_a_pagar)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {data.dividas_pendentes} pendente(s), {data.dividas_parciais} parcial(is)
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1" fontWeight={600}>
              % Pago
            </Typography>
            <Typography variant="body1" fontWeight={600} color="success.main">
              {data.percentual_pago.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={data.percentual_pago}
            color="success"
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            Progresso do pagamento das dívidas
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
