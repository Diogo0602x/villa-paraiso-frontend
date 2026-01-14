import { api } from "./apiClient"
import type { GeoJsonCollection } from "@/types"

export interface GeoJsonFilters {
  setorSlug?: string
  status?: string
  incluirVendas?: boolean
  incluirPoligonos?: boolean // Request polygons instead of points
}

export interface KmlUploadResponse {
  error: string[]
  tempname: string
  tempname2: string
}

export const mapasApi = {
  getGeoJson: (filters?: GeoJsonFilters) => {
    const params = new URLSearchParams()
    if (filters?.setorSlug) params.set("setorSlug", filters.setorSlug)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.incluirVendas !== undefined) params.set("incluirVendas", String(filters.incluirVendas))

    const query = params.toString()
    return api.get<GeoJsonCollection>(`/mapas/geojson${query ? `?${query}` : ""}`)
  },

  getGeoJsonBySetor: (slug: string, incluirVendas = true) => {
    return api.get<GeoJsonCollection>(`/mapas/geojson/setores/${slug}?incluirVendas=${incluirVendas}`)
  },

  getGeoJsonByLote: (id: number) => {
    return api.get<GeoJsonCollection>(`/mapas/geojson/lote/${id}`)
  },

  uploadKml: async (file: File): Promise<KmlUploadResponse> => {
    const formData = new FormData()
    formData.append("uid", "kmlviewer-")
    formData.append("title", file.name)
    formData.append("file1", file)
    formData.append("usespecdir", "ok")
    formData.append("nocheckext", "ok")

    const response = await fetch("https://excelviewer.herokuapp.com/upload/", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Erro ao fazer upload do arquivo: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Verificar se há erros na resposta
    if (data.error && Array.isArray(data.error) && data.error.length > 0) {
      const errorMessages = data.error.filter((msg: string) => msg && msg.trim() !== "")
      if (errorMessages.length > 0) {
        throw new Error(errorMessages.join(", "))
      }
    }
    
    // Verificar se temos uma URL válida
    if (!data.tempname && !data.tempname2) {
      throw new Error("URL do KML não retornada pelo servidor")
    }
    
    return data as KmlUploadResponse
  },

  /**
   * Carrega o arquivo KML padrão automaticamente
   * Retorna a URL do KML para processamento
   */
  getDefaultKmlUrl: async (): Promise<string> => {
    // Tenta carregar do arquivo local no public
    const kmlPath = "/kml/mapas-gerais/localizacao-chacaras-fazenda-teixeira.kml"
    const kmlResponse = await fetch(kmlPath)
    
    if (kmlResponse.ok) {
      // Se o arquivo existe localmente, faz upload para obter URL temporária
      const kmlBlob = await kmlResponse.blob()
      const kmlFile = new File([kmlBlob], "localizacao-chacaras-fazenda-teixeira.kml", {
        type: "application/vnd.google-earth.kml+xml",
      })
      
      const uploadResponse = await mapasApi.uploadKml(kmlFile)
      return uploadResponse.tempname || uploadResponse.tempname2
    }
    
    throw new Error(`Arquivo KML não encontrado em ${kmlPath}`)
  },

  /**
   * Carrega o arquivo KML de um setor específico
   * Retorna a URL do KML para processamento
   */
  getKmlUrlBySetor: async (setorSlug: string): Promise<string> => {
    // Tenta carregar do arquivo local no public
    const kmlPath = `/kml/setores/${setorSlug}.kml`
    const kmlResponse = await fetch(kmlPath)
    
    if (kmlResponse.ok) {
      // Se o arquivo existe localmente, faz upload para obter URL temporária
      const kmlBlob = await kmlResponse.blob()
      const kmlFile = new File([kmlBlob], `${setorSlug}.kml`, {
        type: "application/vnd.google-earth.kml+xml",
      })
      
      const uploadResponse = await mapasApi.uploadKml(kmlFile)
      return uploadResponse.tempname || uploadResponse.tempname2
    }
    
    throw new Error(`Arquivo KML do setor não encontrado em ${kmlPath}`)
  },
}
