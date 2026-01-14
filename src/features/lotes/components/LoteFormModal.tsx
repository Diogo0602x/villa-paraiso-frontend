"use client"

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
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material"
import { useCreateLote, useUpdateLote } from "@/shared/hooks/useLotes"
import { useSetores } from "@/shared/hooks"
import { StatusLote, StatusLoteLabels } from "@/enums"
import type { Lote, LoteCreate, LoteUpdate, StatusLote as StatusLoteType } from "@/types"

interface LoteFormModalProps {
  open: boolean
  onClose: () => void
  lote?: Lote | null
}

export function LoteFormModal({ open, onClose, lote }: LoteFormModalProps) {
  const isEditing = !!lote
  const createMutation = useCreateLote()
  const updateMutation = useUpdateLote()
  const { data: setores } = useSetores()

  const [formData, setFormData] = useState<LoteCreate | LoteUpdate>({
    numero: "",
    setor_id: "",
    status: StatusLote.DISPONIVEL,
    tem_acesso_agua: false,
    frente_br060: false,
    area: null,
    observacoes: null,
  })

  useEffect(() => {
    if (lote) {
      setFormData({
        numero: lote.numero,
        setor_id: lote.setor_id,
        status: lote.status,
        tem_acesso_agua: lote.tem_acesso_agua,
        frente_br060: lote.frente_br060,
        area: lote.area,
        observacoes: lote.observacoes,
      })
    } else {
      setFormData({
        numero: "",
        setor_id: "",
        status: StatusLote.DISPONIVEL,
        tem_acesso_agua: false,
        frente_br060: false,
        area: null,
        observacoes: null,
      })
    }
  }, [lote, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && lote) {
        await updateMutation.mutateAsync({ id: lote.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData as LoteCreate)
      }
      onClose()
    } catch (error) {
      console.error("Erro ao salvar lote:", error)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? "Editar Lote" : "Novo Lote"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Número do Lote"
              value={formData.numero || ""}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Setor</InputLabel>
              <Select
                value={formData.setor_id || ""}
                label="Setor"
                onChange={(e) => setFormData({ ...formData, setor_id: e.target.value })}
              >
                {setores?.map((setor) => (
                  <MenuItem key={setor.id} value={setor.id}>
                    {setor.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || StatusLote.DISPONIVEL}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusLoteType })}
              >
                {Object.entries(StatusLote).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {StatusLoteLabels[value]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Área (m²)"
              type="number"
              value={formData.area || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  area: e.target.value ? Number.parseFloat(e.target.value) : null,
                })
              }
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tem_acesso_agua || false}
                  onChange={(e) => setFormData({ ...formData, tem_acesso_agua: e.target.checked })}
                />
              }
              label="Tem Acesso à Água"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.frente_br060 || false}
                  onChange={(e) => setFormData({ ...formData, frente_br060: e.target.checked })}
                />
              }
              label="Frente BR-060"
            />

            <TextField
              label="Observações"
              value={formData.observacoes || ""}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value || null })}
              multiline
              rows={3}
              fullWidth
            />

            {(createMutation.isError || updateMutation.isError) && (
              <Alert severity="error">Erro ao salvar lote. Tente novamente.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
