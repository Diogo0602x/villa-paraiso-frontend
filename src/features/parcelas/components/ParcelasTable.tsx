"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  Stack,
} from "@mui/material"
import { Visibility, Payment, Edit } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Parcela, PaginationMeta } from "@/types"
import { formatCurrency, formatDate } from "@/utils"
import { StatusChip } from "@/shared/components"
import { StatusParcela } from "@/enums"

interface ParcelasTableProps {
  parcelas: Parcela[]
  meta: PaginationMeta
  page: number
  onPageChange: (page: number) => void
  onRegisterPayment: (parcela: Parcela) => void
  onEditParcela: (parcela: Parcela) => void
}

export function ParcelasTable({
  parcelas,
  meta,
  page,
  onPageChange,
  onRegisterPayment,
  onEditParcela,
}: ParcelasTableProps) {
  const router = useRouter()

  const isOverdue = (parcela: Parcela) => {
    if (parcela.status === StatusParcela.PAGA) return false
    return new Date(parcela.dataVencimento) < new Date()
  }

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
              <TableCell>Parcela</TableCell>
              <TableCell>Venda / Comprador</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parcelas.map((parcela) => (
              <TableRow
                key={parcela.id}
                hover
                sx={{
                  bgcolor: isOverdue(parcela) ? "error.50" : undefined,
                }}
              >
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" fontWeight={500}>
                    {parcela.numeroParcela}ª Parcela
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {parcela.venda?.lote?.setor?.nome} - Lote {parcela.venda?.lote?.numero}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {parcela.venda?.compradorNome}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(parcela.valor)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="body2">{formatDate(parcela.dataVencimento)}</Typography>
                    {isOverdue(parcela) && <Chip label="Atrasada" color="error" size="small" />}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <StatusChip type="parcela" status={parcela.status} />
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap">
                    <Tooltip title="Ver Venda">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/vendas/${parcela.vendaId}`)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Vencimento">
                      <IconButton
                        size="small"
                        onClick={() => onEditParcela(parcela)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {parcela.status !== StatusParcela.PAGA && (
                      <Tooltip title="Registrar Pagamento">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onRegisterPayment(parcela)}
                          sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                        >
                          <Payment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={meta.total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={meta.limit}
        rowsPerPageOptions={[meta.limit]}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  )
}
