"use client"

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { StatusLoteColors, StatusLoteLabels } from "@/enums"
import type { ResumoLotesStatus } from "@/types"

interface LotesStatusChartProps {
  data?: ResumoLotesStatus
  loading?: boolean
}

export function LotesStatusChart({ data, loading = false }: LotesStatusChartProps) {
  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Skeleton variant="text" width="50%" />
          <Box display="flex" justifyContent="center" alignItems="center" height={250}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const chartData = [
    {
      name: StatusLoteLabels.disponivel,
      value: data.disponiveis,
      color: StatusLoteColors.disponivel,
    },
    {
      name: StatusLoteLabels.reservado,
      value: data.reservados,
      color: StatusLoteColors.reservado,
    },
    {
      name: StatusLoteLabels.vendido,
      value: data.vendidos,
      color: StatusLoteColors.vendido,
    },
    {
      name: StatusLoteLabels.indisponivel,
      value: data.indisponiveis,
      color: StatusLoteColors.indisponivel,
    },
  ].filter((item) => item.value > 0) // Remover itens com valor zero

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Status dos Lotes
        </Typography>
        <Box height={250}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, "Lotes"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Total: {data.total} lotes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
