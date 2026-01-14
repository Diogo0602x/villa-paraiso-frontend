"use client"

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Box,
  Button,
} from "@mui/material"
import Link from "next/link"
import { formatCurrency } from "@/shared/utils/format"
import { formatDate } from "@/lib/date"
import type { Venda } from "@/types"

interface RecentVendasProps {
  data?: Venda[]
  loading?: boolean
}

export function RecentVendas({ data, loading = false }: RecentVendasProps) {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" height={200} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Vendas Recentes</Typography>
          <Button component={Link} href="/vendas" size="small">
            Ver todas
          </Button>
        </Box>

        {!data || data.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Nenhuma venda recente
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Comprador</TableCell>
                  <TableCell>Lote</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 5).map((venda) => (
                  <TableRow key={venda.id} hover>
                    <TableCell>{venda.compradorNome}</TableCell>
                    <TableCell>{venda.lote?.numero || "-"}</TableCell>
                    <TableCell align="right">{formatCurrency(venda.valorTotal)}</TableCell>
                    <TableCell align="right">{formatDate(venda.dataVenda)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}
