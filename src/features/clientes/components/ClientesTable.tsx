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
import { Visibility, Warning } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import type { Cliente } from "@/hooks/useClientes"
import { formatCurrency } from "@/utils"

interface ClientesTableProps {
  clientes: Cliente[]
}

export function ClientesTable({ clientes }: ClientesTableProps) {
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
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Nome</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Contato</TableCell>
              <TableCell align="center" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Vendas</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Valor Total</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Pago</TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Pendente</TableCell>
              <TableCell align="right" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.nome} hover>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="body2" fontWeight={500}>
                      {cliente.nome}
                    </Typography>
                    {cliente.parcelasAtrasadas > 0 && (
                      <Tooltip title={`${cliente.parcelasAtrasadas} parcela(s) atrasada(s)`}>
                        <Warning color="error" fontSize="small" />
                      </Tooltip>
                    )}
                  </Box>
                  {cliente.cpf && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                      CPF: {cliente.cpf}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Box>
                    {cliente.telefone && <Typography variant="body2">{cliente.telefone}</Typography>}
                    {cliente.email && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                        {cliente.email}
                      </Typography>
                    )}
                    {!cliente.telefone && !cliente.email && (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Chip label={cliente.totalVendas} size="small" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }} />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(cliente.valorTotal)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(cliente.valorPago)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Typography
                    variant="body2"
                    color={cliente.parcelasAtrasadas > 0 ? "error.main" : "warning.main"}
                    fontWeight={cliente.parcelasAtrasadas > 0 ? 600 : 400}
                  >
                    {formatCurrency(cliente.valorPendente)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                  <Tooltip title="Ver Detalhes">
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/clientes/${encodeURIComponent(cliente.nome)}`)}
                      sx={{ minWidth: { xs: 32, sm: 40 }, minHeight: { xs: 32, sm: 40 } }}
                    >
                      <Visibility fontSize="small" />
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
