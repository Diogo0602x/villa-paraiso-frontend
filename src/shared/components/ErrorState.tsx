"use client"

import { Box, Typography, Button } from "@mui/material"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import { ApiException } from "@/services/apiClient"

interface ErrorStateProps {
  error?: Error | ApiException | null
  message?: string
  onRetry?: () => void
}

export function ErrorState({ error, message, onRetry }: ErrorStateProps) {
  const errorMessage =
    message ||
    (error instanceof ApiException
      ? error.getFirstMessage()
      : error?.message || "Ocorreu um erro inesperado.")

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
      py={4}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />
      <Typography variant="h6" color="error">
        Erro ao carregar dados
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {errorMessage}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </Box>
  )
}
