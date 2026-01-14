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

    console.log("📤 Fazendo upload do KML para excelviewer.herokuapp.com...", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })

    const response = await fetch("https://excelviewer.herokuapp.com/upload/", {
      method: "POST",
      body: formData,
    })

    console.log("📥 Resposta do upload:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Erro na resposta do upload:", errorText)
      throw new Error(`Erro ao fazer upload do arquivo: ${response.status} ${response.statusText}`)
    }

    // Verificar se a resposta está vazia
    const responseText = await response.text()
    console.log("📄 Conteúdo da resposta (primeiros 500 chars):", responseText.substring(0, 500))

    if (!responseText || responseText.trim() === "") {
      console.error("❌ Resposta vazia do excelviewer.herokuapp.com")
      console.warn("⚠️ O serviço externo pode estar offline. Considere usar a rota /api/kml/public como alternativa.")
      throw new Error("Resposta vazia do servidor de upload. O serviço pode estar offline.")
    }

    let data: KmlUploadResponse
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError, "Resposta:", responseText)
      throw new Error("Resposta inválida do servidor de upload (não é JSON válido)")
    }
    
    console.log("📦 Dados parseados:", data)
    
    // Verificar se há erros na resposta
    if (data.error && Array.isArray(data.error) && data.error.length > 0) {
      const errorMessages = data.error.filter((msg: string) => msg && msg.trim() !== "")
      if (errorMessages.length > 0) {
        throw new Error(errorMessages.join(", "))
      }
    }
    
    // Verificar se temos uma URL válida
    const kmlUrl = data.tempname || data.tempname2
    if (!kmlUrl) {
      console.error("❌ URL do KML não encontrada na resposta:", data)
      throw new Error("URL do KML não retornada pelo servidor")
    }
    
    console.log("✅ URL do KML obtida:", kmlUrl)
    return data as KmlUploadResponse
  },

  /**
   * Carrega o arquivo KML padrão automaticamente
   * Retorna a URL do KML para processamento
   * Tenta primeiro usar a rota pública local, se falhar, tenta upload externo
   */
  getDefaultKmlUrl: async (): Promise<string> => {
    const kmlPath = "/kml/mapas-gerais/localizacao-chacaras-fazenda-teixeira.kml"
    
    // Primeiro, tentar usar a rota pública local (mais rápido e confiável)
    if (typeof window !== "undefined") {
      const publicUrl = `${window.location.origin}/api/kml/public?path=${encodeURIComponent(kmlPath)}`
      console.log("🔄 Tentando usar rota pública local:", publicUrl)
      
      // Verificar se a rota funciona
      try {
        const testResponse = await fetch(publicUrl, { method: "HEAD" })
        if (testResponse.ok) {
          console.log("✅ Rota pública local disponível, usando:", publicUrl)
          return publicUrl
        }
      } catch (error) {
        console.warn("⚠️ Rota pública local não disponível, tentando upload externo:", error)
      }
    }
    
    // Fallback: fazer upload para serviço externo
    console.log("🔄 Fazendo upload para serviço externo...")
    const kmlResponse = await fetch(kmlPath)
    
    if (kmlResponse.ok) {
      const kmlBlob = await kmlResponse.blob()
      const kmlFile = new File([kmlBlob], "localizacao-chacaras-fazenda-teixeira.kml", {
        type: "application/vnd.google-earth.kml+xml",
      })
      
      try {
        const uploadResponse = await mapasApi.uploadKml(kmlFile)
        return uploadResponse.tempname || uploadResponse.tempname2
      } catch (uploadError) {
        console.error("❌ Erro no upload externo, tentando rota pública local novamente:", uploadError)
        // Se o upload externo falhar, tentar a rota pública local novamente
        if (typeof window !== "undefined") {
          const publicUrl = `${window.location.origin}/api/kml/public?path=${encodeURIComponent(kmlPath)}`
          console.log("🔄 Fallback: usando rota pública local:", publicUrl)
          return publicUrl
        }
        throw uploadError
      }
    }
    
    throw new Error(`Arquivo KML não encontrado em ${kmlPath}`)
  },

  /**
   * Carrega o arquivo KML de um setor específico
   * Retorna a URL do KML para processamento
   * Tenta primeiro usar a rota pública local, se falhar, tenta upload externo
   */
  getKmlUrlBySetor: async (setorSlug: string): Promise<string> => {
    const kmlPath = `/kml/setores/${setorSlug}.kml`
    
    // Primeiro, tentar usar a rota pública local (mais rápido e confiável)
    if (typeof window !== "undefined") {
      const publicUrl = `${window.location.origin}/api/kml/public?path=${encodeURIComponent(kmlPath)}`
      console.log("🔄 Tentando usar rota pública local para setor:", publicUrl)
      
      // Verificar se a rota funciona
      try {
        const testResponse = await fetch(publicUrl, { method: "HEAD" })
        if (testResponse.ok) {
          console.log("✅ Rota pública local disponível, usando:", publicUrl)
          return publicUrl
        }
      } catch (error) {
        console.warn("⚠️ Rota pública local não disponível, tentando upload externo:", error)
      }
    }
    
    // Fallback: fazer upload para serviço externo
    console.log("🔄 Fazendo upload para serviço externo...")
    const kmlResponse = await fetch(kmlPath)
    
    if (kmlResponse.ok) {
      const kmlBlob = await kmlResponse.blob()
      const kmlFile = new File([kmlBlob], `${setorSlug}.kml`, {
        type: "application/vnd.google-earth.kml+xml",
      })
      
      try {
        const uploadResponse = await mapasApi.uploadKml(kmlFile)
        return uploadResponse.tempname || uploadResponse.tempname2
      } catch (uploadError) {
        console.error("❌ Erro no upload externo, tentando rota pública local novamente:", uploadError)
        // Se o upload externo falhar, tentar a rota pública local novamente
        if (typeof window !== "undefined") {
          const publicUrl = `${window.location.origin}/api/kml/public?path=${encodeURIComponent(kmlPath)}`
          console.log("🔄 Fallback: usando rota pública local:", publicUrl)
          return publicUrl
        }
        throw uploadError
      }
    }
    
    throw new Error(`Arquivo KML do setor não encontrado em ${kmlPath}`)
  },
}
