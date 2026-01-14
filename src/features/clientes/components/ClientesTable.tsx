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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell align="center">Vendas</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell>Pendente</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.nome} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    <Typography variant="caption" color="text.secondary">
                      CPF: {cliente.cpf}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box>
                    {cliente.telefone && <Typography variant="body2">{cliente.telefone}</Typography>}
                    {cliente.email && (
                      <Typography variant="caption" color="text.secondary">
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
                <TableCell align="center">
                  <Chip label={cliente.totalVendas} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(cliente.valorTotal)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="success.main">
                    {formatCurrency(cliente.valorPago)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color={cliente.parcelasAtrasadas > 0 ? "error.main" : "warning.main"}
                    fontWeight={cliente.parcelasAtrasadas > 0 ? 600 : 400}
                  >
                    {formatCurrency(cliente.valorPendente)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver Detalhes">
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/clientes/${encodeURIComponent(cliente.nome)}`)}
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
