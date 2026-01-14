"use client"

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Link from "next/link"
import { formatCurrency } from "@/shared/utils/format"
import { formatDate } from "@/lib/date"
import { EmptyState, DataTableSkeleton } from "@/shared/components"
import type { Venda, PaginationMeta } from "@/types"

interface VendasTableProps {
  data?: Venda[]
  meta?: PaginationMeta
  loading?: boolean
  page: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onDelete: (venda: Venda) => void
}

export function VendasTable({
  data,
  meta,
  loading,
  page,
  onPageChange,
  onRowsPerPageChange,
  onDelete,
}: VendasTableProps) {
  if (loading) {
    return <DataTableSkeleton columns={7} rows={5} />
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4 }}>
        <EmptyState
          title="Nenhuma venda encontrada"
          description="Não há vendas que correspondam aos filtros selecionados."
          action={{
            label: "Nova Venda",
            onClick: () => (window.location.href = "/vendas/nova"),
          }}
        />
      </Paper>
    )
  }

  return (
    <Paper>
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
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Lote</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Setor</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Comprador</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor Total</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Entrada</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Data Venda</TableCell>
              <TableCell align="center" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((venda) => (
              <TableRow key={venda.id} hover>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{venda.lote?.numero || "-"}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{venda.lote?.setor?.nome || "-"}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{venda.compradorNome}</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  {formatCurrency(venda.valorTotal)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  {formatCurrency(venda.valorEntrada)}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>{formatDate(venda.dataVenda)}</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box display="flex" justifyContent="center" gap={0.5} flexWrap="wrap">
                    <Tooltip title="Ver detalhes">
                      <IconButton
                        component={Link}
                        href={`/vendas/${venda.id}`}
                        size="small"
                        color="primary"
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        component={Link}
                        href={`/vendas/${venda.id}/editar`}
                        size="small"
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(venda)}
                        sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {meta && (
        <TablePagination
          component="div"
          count={meta.total}
          page={page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={meta.limit}
          onRowsPerPageChange={(e) => onRowsPerPageChange(Number.parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      )}
    </Paper>
  )
}
