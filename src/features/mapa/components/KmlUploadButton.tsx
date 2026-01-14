"use client"

import { useState, useRef } from "react"
import { Button, CircularProgress, Box, Alert } from "@mui/material"
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { mapasApi } from "@/services/mapasApi"

interface KmlUploadButtonProps {
  onUploadSuccess: (kmlUrl: string) => void
  disabled?: boolean
}

export function KmlUploadButton({ onUploadSuccess, disabled }: KmlUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".kml")) {
      setError("Por favor, selecione um arquivo KML válido")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const response = await mapasApi.uploadKml(file)
      
      if (response.error && response.error.length > 0) {
        throw new Error(response.error.join(", "))
      }

      // Use tempname or tempname2 (both are the same URL)
      const kmlUrl = response.tempname || response.tempname2
      if (!kmlUrl) {
        throw new Error("URL do KML não retornada pelo servidor")
      }

      onUploadSuccess(kmlUrl)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer upload do arquivo"
      setError(errorMessage)
      console.error("Erro no upload:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept=".kml"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <Button
        variant="outlined"
        startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        fullWidth
      >
        {isUploading ? "Enviando..." : "Carregar Arquivo KML"}
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
