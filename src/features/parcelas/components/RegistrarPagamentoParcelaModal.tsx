"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Typography,
  Box,
} from "@mui/material"
import { useCreatePagamento } from "@/hooks/usePagamentos"
import { useToast } from "@/shared/providers"
import { FormaPagamento } from "@/enums"
import { FormaPagamentoLabels } from "@/enums"
import type { Parcela } from "@/types"
import { formatCurrency } from "@/utils"

interface RegistrarPagamentoParcelaModalProps {
  open: boolean
  onClose: () => void
  parcela: Parcela | null
}

export function RegistrarPagamentoParcelaModal({ open, onClose, parcela }: RegistrarPagamentoParcelaModalProps) {
  const [valor, setValor] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(FormaPagamento.PIX)
  const [observacoes, setObservacoes] = useState("")

  const createMutation = useCreatePagamento()
  const { showToast } = useToast()

  useEffect(() => {
    if (parcela) {
      // Calculate remaining value
      const totalPago = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
      const restante = parcela.valor - totalPago
      setValor(String(restante))
      setDataPagamento(new Date().toISOString().split("T")[0])
    }
  }, [parcela])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcela) return

    try {
      await createMutation.mutateAsync({
        parcelaId: parcela.id,
        valor: Number(valor),
        dataPagamento,
        formaPagamento,
        observacoes: observacoes || undefined,
      })
      showToast("Pagamento registrado com sucesso!", "success")
      onClose()
    } catch (error) {
      showToast("Erro ao registrar pagamento", "error")
    }
  }

  if (!parcela) return null

  const totalPago = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
  const restante = parcela.valor - totalPago

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Box>
                <Typography variant="body2">
                  Parcela {parcela.numeroParcela} - Valor: {formatCurrency(parcela.valor)}
                </Typography>
                <Typography variant="body2">
                  Já pago: {formatCurrency(totalPago)} | Restante: <strong>{formatCurrency(restante)}</strong>
                </Typography>
              </Box>
            </Alert>

            <TextField
              label="Valor do Pagamento"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              inputProps={{ min: 0.01, max: restante, step: 0.01 }}
              required
              fullWidth
              helperText={`Máximo: ${formatCurrency(restante)}`}
            />

            <TextField
              label="Data do Pagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Forma de Pagamento</InputLabel>
              <Select
                value={formaPagamento}
                label="Forma de Pagamento"
                onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
              >
                {Object.entries(FormaPagamentoLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Observações"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Salvando..." : "Registrar Pagamento"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
