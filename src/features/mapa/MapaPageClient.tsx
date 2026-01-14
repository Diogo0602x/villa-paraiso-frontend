"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Stack, Typography } from "@mui/material"
import { PageHeader } from "@/shared/components"
import { GoogleMapComponent, MapLegend, MapFilters, type MapFiltersState } from "./components"
import { useDefaultKml, useKmlsBySetores } from "@/hooks/useMapData"

// Lista de setores baseada nos arquivos KML disponíveis em mapeamento/setores
const SETORES_DISPONIVEIS = [
  { slug: "setor-aguas-do-cerrado", nome: "Águas do Cerrado" },
  { slug: "setor-ipe-roxo", nome: "Ipê Roxo" },
  { slug: "setor-montes-claros", nome: "Montes Claros" },
  { slug: "setor-portal-do-cerrado", nome: "Portal do Cerrado" },
  { slug: "setor-riacho-dourado", nome: "Riacho Dourado" },
  { slug: "setor-vista-do-sol", nome: "Vista do Sol" },
]

export function MapaPageClient() {
  const [selectedLoteId, setSelectedLoteId] = useState<string | number | null>(null)
  const [shouldLoadKml, setShouldLoadKml] = useState(false)
  const [filters, setFilters] = useState<MapFiltersState>({
    kmlGeralSelecionado: true, // Inicializar com KML geral selecionado por padrão
    setoresSelecionados: [], // Inicializar com array vazio
  })
  
  // Aguardar um pouco antes de iniciar o upload para garantir que a página está pronta
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🚀 Iniciando carregamento do KML...")
      setShouldLoadKml(true)
    }, 500) // Aguardar 500ms antes de iniciar
    
    return () => clearTimeout(timer)
  }, [])
  
  // Carrega o KML padrão se o KML geral estiver selecionado
  const setoresSelecionados = filters.setoresSelecionados || []
  const shouldLoadDefault = shouldLoadKml && (filters.kmlGeralSelecionado || setoresSelecionados.length === 0)
  const { data: defaultKmlUrl, isLoading: isLoadingDefaultKml } = useDefaultKml(shouldLoadDefault)
  
  // Carrega KMLs dos setores selecionados (só se KML geral não estiver selecionado)
  const { data: setorKmlUrls, isLoading: isLoadingSetores } = useKmlsBySetores(
    setoresSelecionados,
    shouldLoadKml && !filters.kmlGeralSelecionado && setoresSelecionados.length > 0
  )
  
  // Coletar todas as URLs de KML disponíveis
  const kmlUrls: string[] = []
  
  // Adicionar KML padrão se o KML geral estiver selecionado
  if (filters.kmlGeralSelecionado && defaultKmlUrl && typeof defaultKmlUrl === "string") {
    kmlUrls.push(defaultKmlUrl)
  }
  
  // Adicionar KMLs dos setores selecionados (só se KML geral não estiver selecionado)
  if (!filters.kmlGeralSelecionado && setorKmlUrls && setorKmlUrls.length > 0) {
    kmlUrls.push(...setorKmlUrls)
  }
  
  // Verificar se está carregando
  const isLoadingKml = isLoadingDefaultKml || isLoadingSetores
  
  // Debug: log quando kmlUrls estiverem disponíveis
  useEffect(() => {
    if (kmlUrls.length > 0) {
      const tipo = filters.kmlGeralSelecionado 
        ? "KML geral" 
        : `(${setoresSelecionados.length} setores)`
      console.log("✅ KML URLs em uso:", kmlUrls, tipo)
    }
  }, [kmlUrls, setoresSelecionados, filters.kmlGeralSelecionado])

  return (
    <Box sx={{ minHeight: { xs: "auto", md: "calc(100vh - 140px)" }, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Mapa" subtitle="Visualização interativa dos lotes" />

      <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={{ xs: 1.5, md: 2 }}>
            {/* Filters */}
            <MapFilters 
              filters={filters} 
              setores={SETORES_DISPONIVEIS.map(s => ({ id: s.slug, nome: s.nome, slug: s.slug }))} 
              onFiltersChange={setFilters}
            />

            {/* Legend */}
            <MapLegend />
          </Stack>
        </Grid>

        {/* Map */}
        <Grid size={{ xs: 12, md: 9 }} sx={{ height: { xs: 400, md: "100%" }, minHeight: { xs: 400, md: 500 } }}>
          {shouldLoadKml ? (
            <GoogleMapComponent
              kmlUrls={kmlUrls}
              isLoading={isLoadingKml}
              selectedLoteId={selectedLoteId || undefined}
              onLoteSelect={setSelectedLoteId}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Preparando mapa...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
