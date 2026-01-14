"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert } from "@mui/material"
import { useUpdateParcela } from "@/hooks/useParcelas"
import { useToast } from "@/shared/providers"
import type { Parcela } from "@/types"
import { formatCurrency } from "@/utils"

interface EditParcelaModalProps {
  open: boolean
  onClose: () => void
  parcela: Parcela | null
}

export function EditParcelaModal({ open, onClose, parcela }: EditParcelaModalProps) {
  const [dataVencimento, setDataVencimento] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const updateMutation = useUpdateParcela()
  const { showToast } = useToast()

  useEffect(() => {
    if (parcela) {
      setDataVencimento(parcela.dataVencimento.split("T")[0])
      setObservacoes(parcela.observacoes || "")
    }
  }, [parcela])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!parcela) return

    try {
      await updateMutation.mutateAsync({
        id: parcela.id,
        data: {
          dataVencimento,
          observacoes: observacoes || undefined,
        },
      })
      showToast("Parcela atualizada com sucesso!", "success")
      onClose()
    } catch (error) {
      showToast("Erro ao atualizar parcela", "error")
    }
  }

  if (!parcela) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Parcela {parcela.numeroParcela}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              Valor da parcela: <strong>{formatCurrency(parcela.valor)}</strong>
            </Alert>

            <TextField
              label="Data de Vencimento"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <TextField
              label="Observações"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              multiline
              rows={3}
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
