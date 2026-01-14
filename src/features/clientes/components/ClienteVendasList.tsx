"use client"

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material"
import { Visibility } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Venda } from "@/types"
import { formatCurrency, formatDate } from "@/utils"
import { StatusParcela } from "@/enums"

interface ClienteVendasListProps {
  vendas: Venda[]
}

export function ClienteVendasList({ vendas }: ClienteVendasListProps) {
  const router = useRouter()

  const getVendaStatus = (venda: Venda) => {
    if (!venda.parcelas || venda.parcelas.length === 0) return "pendente"

    const todasPagas = venda.parcelas.every((p) => p.status === StatusParcela.PAGA)
    if (todasPagas) return "quitado"

    const temAtrasada = venda.parcelas.some(
      (p) => p.status !== StatusParcela.PAGA && new Date(p.dataVencimento) < new Date(),
    )
    if (temAtrasada) return "atrasado"

    return "em_dia"
  }

  const statusColors: Record<string, "success" | "warning" | "error" | "default"> = {
    quitado: "success",
    em_dia: "default",
    atrasado: "error",
    pendente: "warning",
  }

  const statusLabels: Record<string, string> = {
    quitado: "Quitado",
    em_dia: "Em Dia",
    atrasado: "Atrasado",
    pendente: "Pendente",
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vendas ({vendas.length})
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Lote</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Parcelas</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendas.map((venda) => {
                const status = getVendaStatus(venda)
                return (
                  <TableRow key={venda.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {venda.lote?.setor?.nome} - Lote {venda.lote?.numero}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                    <TableCell>{formatCurrency(venda.valorTotal)}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${venda.parcelas?.filter((p) => p.status === StatusParcela.PAGA).length || 0}/${venda.quantidadeParcelas}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={statusLabels[status]} color={statusColors[status]} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver Venda">
                        <IconButton size="small" onClick={() => router.push(`/vendas/${venda.id}`)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
