"use client"

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getMonthName } from "@/lib/date"
import { formatCurrency } from "@/shared/utils/format"
import type { FaturamentoMensal } from "@/types"

interface FaturamentoChartProps {
  data?: FaturamentoMensal[]
  loading?: boolean
}

export function FaturamentoChart({ data, loading = false }: FaturamentoChartProps) {
  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width="50%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={300} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : []

  if (!dataArray || dataArray.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Faturamento Mensal
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <Typography color="text.secondary">Nenhum dado disponível</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const chartData = dataArray.map((item) => ({
    mes: getMonthName(item.mes).substring(0, 3),
    esperado: item.valorEsperado,
    recebido: item.valorRecebido,
    pendente: item.valorPendente,
  }))

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Faturamento Mensal
        </Typography>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend />
              <Bar dataKey="esperado" name="Esperado" fill="#2196f3" />
              <Bar dataKey="recebido" name="Recebido" fill="#4caf50" />
              <Bar dataKey="pendente" name="Pendente" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
