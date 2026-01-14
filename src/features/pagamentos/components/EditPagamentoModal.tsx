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
} from "@mui/material"
import { useUpdatePagamento } from "@/hooks/usePagamentos"
import { useToast } from "@/shared/providers"
import { FormaPagamento } from "@/enums"
import { FormaPagamentoLabels } from "@/enums"
import type { Pagamento } from "@/types"

interface EditPagamentoModalProps {
  open: boolean
  onClose: () => void
  pagamento: Pagamento | null
}

export function EditPagamentoModal({ open, onClose, pagamento }: EditPagamentoModalProps) {
  const [valor, setValor] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(FormaPagamento.PIX)
  const [observacoes, setObservacoes] = useState("")

  const updateMutation = useUpdatePagamento()
  const { showToast } = useToast()

  useEffect(() => {
    if (pagamento) {
      setValor(String(pagamento.valor))
      setDataPagamento(pagamento.dataPagamento.split("T")[0])
      setFormaPagamento(pagamento.formaPagamento)
      setObservacoes(pagamento.observacoes || "")
    }
  }, [pagamento])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pagamento) return

    try {
      await updateMutation.mutateAsync({
        id: pagamento.id,
        data: {
          valor: Number(valor),
          dataPagamento,
          formaPagamento,
          observacoes: observacoes || undefined,
        },
      })
      showToast("Pagamento atualizado com sucesso!", "success")
      onClose()
    } catch (error) {
      showToast("Erro ao atualizar pagamento", "error")
    }
  }

  if (!pagamento) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Pagamento</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              inputProps={{ min: 0.01, step: 0.01 }}
              required
              fullWidth
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
          <Button type="submit" variant="contained" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
