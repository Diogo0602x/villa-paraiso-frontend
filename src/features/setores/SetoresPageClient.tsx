"use client"

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Paper,
} from "@mui/material"
import Image from "next/image"
import { PageHeader } from "@/shared/components"
import { useSetores } from "@/shared/hooks"

export function SetoresPageClient() {
  const { data: setores, isLoading, error } = useSetores()

  return (
    <Box sx={{ height: "calc(100vh - 140px)", display: "flex", flexDirection: "column" }}>
      <PageHeader title="Setores" subtitle="Gerenciamento de setores" />

      {error ? (
        <Alert severity="error">Erro ao carregar setores. Tente novamente mais tarde.</Alert>
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Mapa do Loteamento */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mapa do Loteamento
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "auto",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Image
                    src="/Mapa_Loteamento_Finalizado_21-Set-2025.jpg"
                    alt="Mapa do Loteamento Villa Paraíso"
                    width={1200}
                    height={800}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    priority
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cards de Setores */}
          {setores && setores.length > 0 ? (
            <>
              {setores.map((setor) => (
                <Grid key={setor.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {setor.nome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {setor.slug}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Total de Lotes:
                          </Typography>
                          <Chip label={setor.total_lotes} size="small" color="primary" />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Lotes com Água:
                          </Typography>
                          <Chip label={setor.lotes_com_agua} size="small" color="success" />
                        </Box>
                        {setor.cor && (
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                              Cor:
                            </Typography>
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: 1,
                                bgcolor: setor.cor,
                                border: "1px solid rgba(0,0,0,0.2)",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                      {setor.observacoes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                          {setor.observacoes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </>
          ) : (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">Nenhum setor encontrado.</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}
