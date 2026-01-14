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
  Stack,
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
      <TableContainer
        sx={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 4,
          },
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Data</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Parcela / Venda</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Forma</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Observações</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagamentos.map((pagamento) => (
              <TableRow key={pagamento.id} hover>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(pagamento.dataPagamento)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Parcela {pagamento.parcela?.numeroParcela}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                      {pagamento.parcela?.venda?.compradorNome}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    {formatCurrency(pagamento.valor)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Chip
                    label={FormaPagamentoLabels[pagamento.formaPagamento]}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: { xs: 150, sm: 200 } }}>
                    {pagamento.observacoes || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap">
                    <Tooltip title="Ver Venda">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/vendas/${pagamento.parcela?.vendaId}`)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(pagamento)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(pagamento)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
