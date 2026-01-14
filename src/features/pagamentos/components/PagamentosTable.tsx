"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
} from "@mui/material"
import { Visibility, Edit, Delete } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Pagamento } from "@/types"
import { formatCurrency, formatDate } from "@/utils"
import { FormaPagamentoLabels } from "@/enums"

interface PagamentosTableProps {
  pagamentos: Pagamento[]
  onEdit: (pagamento: Pagamento) => void
  onDelete: (pagamento: Pagamento) => void
}

export function PagamentosTable({ pagamentos, onEdit, onDelete }: PagamentosTableProps) {
  const router = useRouter()

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Parcela / Venda</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Forma</TableCell>
              <TableCell>Observações</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagamentos.map((pagamento) => (
              <TableRow key={pagamento.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(pagamento.dataPagamento)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Parcela {pagamento.parcela?.numeroParcela}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pagamento.parcela?.venda?.compradorNome}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    {formatCurrency(pagamento.valor)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={FormaPagamentoLabels[pagamento.formaPagamento]} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {pagamento.observacoes || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver Venda">
                    <IconButton size="small" onClick={() => router.push(`/vendas/${pagamento.parcela?.vendaId}`)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => onEdit(pagamento)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => onDelete(pagamento)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
