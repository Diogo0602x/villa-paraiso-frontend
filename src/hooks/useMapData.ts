"use client"

import { useQuery, useQueries } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { mapasApi, type GeoJsonFilters } from "@/services/mapasApi"

export function useGeoJson(filters?: GeoJsonFilters) {
  return useQuery({
    queryKey: queryKeys.mapas.geojson(filters),
    queryFn: () => mapasApi.getGeoJson(filters),
  })
}

export function useGeoJsonBySetor(slug: string, incluirVendas = true) {
  return useQuery({
    queryKey: queryKeys.mapas.geojsonSetor(slug, { incluirVendas }),
    queryFn: () => mapasApi.getGeoJsonBySetor(slug, incluirVendas),
    enabled: !!slug,
  })
}

export function useGeoJsonByLote(id: number) {
  return useQuery({
    queryKey: queryKeys.mapas.geojsonLote(id),
    queryFn: () => mapasApi.getGeoJsonByLote(id),
    enabled: !!id,
  })
}

/**
 * Hook para carregar automaticamente o KML padrão ao entrar na página
 * Com cache e aguarda o upload completar antes de retornar
 */
export function useDefaultKml(enabled: boolean = true) {
  return useQuery({
    queryKey: ["mapas", "default-kml"],
    queryFn: async () => {
      console.log("📤 Iniciando upload do KML padrão...")
      const url = await mapasApi.getDefaultKmlUrl()
      if (!url) {
        throw new Error("URL do KML não foi retornada")
      }
      
      // Aguardar um pouco para garantir que o servidor processou o upload
      console.log("⏳ Aguardando processamento do servidor...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log("✅ URL do KML obtida:", url)
      return url
    },
    enabled, // Só executa se enabled for true
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos
    cacheTime: 30 * 60 * 1000, // Manter no cache por 30 minutos
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false, // Não recarregar ao focar na janela
    refetchOnMount: false, // Não recarregar ao montar se já estiver em cache
  })
}

/**
 * Hook para carregar KML de um setor específico
 */
export function useKmlBySetor(setorSlug: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ["mapas", "kml-setor", setorSlug],
    queryFn: async () => {
      if (!setorSlug) {
        throw new Error("Slug do setor é obrigatório")
      }
      
      console.log("📤 Iniciando upload do KML do setor:", setorSlug)
      const url = await mapasApi.getKmlUrlBySetor(setorSlug)
      if (!url) {
        throw new Error("URL do KML não foi retornada")
      }
      
      // Aguardar um pouco para garantir que o servidor processou o upload
      console.log("⏳ Aguardando processamento do servidor...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      console.log("✅ URL do KML do setor obtida:", url)
      return url
    },
    enabled: enabled && !!setorSlug, // Só executa se enabled for true e setorSlug existir
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos
    cacheTime: 30 * 60 * 1000, // Manter no cache por 30 minutos
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

/**
 * Hook para carregar múltiplos KMLs de setores
 * Retorna um objeto com as URLs dos KMLs carregados
 */
export function useKmlsBySetores(setorSlugs: string[], enabled: boolean = true) {
  const queries = useQueries({
    queries: setorSlugs.map((slug) => ({
      queryKey: ["mapas", "kml-setor", slug],
      queryFn: async () => {
        console.log("📤 Iniciando upload do KML do setor:", slug)
        const url = await mapasApi.getKmlUrlBySetor(slug)
        if (!url) {
          throw new Error("URL do KML não foi retornada")
        }
        
        // Aguardar um pouco para garantir que o servidor processou o upload
        console.log("⏳ Aguardando processamento do servidor...")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        
        console.log("✅ URL do KML do setor obtida:", url)
        return url
      },
      enabled: enabled && !!slug,
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  })
  
  return {
    data: queries.map((q) => q.data).filter((url): url is string => typeof url === "string"),
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
    errors: queries.map((q) => q.error).filter(Boolean),
  }
}
