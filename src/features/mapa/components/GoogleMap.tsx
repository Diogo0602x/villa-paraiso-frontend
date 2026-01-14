"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Box, Paper, CircularProgress } from "@mui/material"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"

const MAP_DEFAULT_CENTER = { lat: -15.7801, lng: -47.9292 } // Brasília
const MAP_DEFAULT_ZOOM = 10
const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
}

const libraries: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[] = []

interface GoogleMapComponentProps {
  kmlUrls: string[] | null // Array de URLs de KML para exibir múltiplos layers
  isLoading: boolean
  selectedLoteId?: string | number | null
  onLoteSelect?: (loteId: string | number | null) => void
}

export function GoogleMapComponent({ kmlUrls, isLoading, selectedLoteId, onLoteSelect }: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const kmlLayersRef = useRef<Map<string, google.maps.KmlLayer>>(new Map()) // Mapa de URL -> KmlLayer
  const previousKmlUrlsRef = useRef<string[]>([])

  // Get Google Maps API key from environment
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  })

  // Memoizar onLoteSelect para evitar problemas de parsing
  const handleLoteSelect = useCallback((loteId: string | number | null) => {
    onLoteSelect?.(loteId)
  }, [onLoteSelect])

  // Handle map load
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    console.log("🗺️ Google Map carregado")
  }, [])

  // Handle map unmount
  const onMapUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Load KML layers when URLs are available - suporta múltiplos KMLs
  useEffect(() => {
    // Verificar condições iniciais
    const shouldLoad = map && kmlUrls && Array.isArray(kmlUrls) && kmlUrls.length > 0 && isLoaded && !isLoading
    
    if (!shouldLoad) {
      console.log("⏸️ Aguardando condições:", { map: !!map, kmlUrls: kmlUrls?.length || 0, isLoaded, isLoading })
      return
    }

    // Verificar se as URLs mudaram
    const urlsChanged: boolean =
      previousKmlUrlsRef.current.length !== kmlUrls.length ||
      !previousKmlUrlsRef.current.every((url) => kmlUrls.includes(url)) ||
      !kmlUrls.every((url) => previousKmlUrlsRef.current.includes(url))

    if (!urlsChanged && kmlLayersRef.current.size === kmlUrls.length) {
      console.log("📋 KMLs já carregados, usando cache")
      return
    }

    console.log("🔄 Carregando KMLs no Google Maps:", kmlUrls)
    previousKmlUrlsRef.current = [...kmlUrls]

    // Remover layers que não estão mais na lista
    const urlsToRemove: string[] = []
    kmlLayersRef.current.forEach((layer, url) => {
      if (!kmlUrls.includes(url)) {
        console.log("🗑️ Removendo KML layer:", url)
        layer.setMap(null)
        urlsToRemove.push(url)
      }
    })
    urlsToRemove.forEach((url) => kmlLayersRef.current.delete(url))

    // Aguardar um pouco para garantir que o servidor processou o upload completamente
    const loadKmls = (): void => {
      const bounds = new google.maps.LatLngBounds()
      let loadedCount = 0
      const totalKmls = kmlUrls.length

      kmlUrls.forEach((kmlUrl) => {
        // Se já existe um layer para esta URL, não recarregar
        if (kmlLayersRef.current.has(kmlUrl)) {
          console.log("📋 KML já carregado, pulando:", kmlUrl)
          loadedCount++
          const existingLayer = kmlLayersRef.current.get(kmlUrl)
          if (existingLayer) {
            const viewport = existingLayer.getDefaultViewport()
            if (viewport) {
              bounds.union(viewport)
            }
          }
          return
        }

        // IMPORTANTE: O Google Maps KmlLayer precisa de uma URL pública acessível
        // Se a URL já for pública (https://), usar diretamente
        // O Google Maps consegue acessar URLs públicas mesmo com CORS
        const finalUrl: string = 
          kmlUrl.startsWith("https://") || kmlUrl.startsWith("http://")
            ? kmlUrl // URL pública - usar diretamente
            : `/api/kml?url=${encodeURIComponent(kmlUrl)}&t=${Date.now()}` // URL local - usar proxy
        
        if (kmlUrl.startsWith("https://") || kmlUrl.startsWith("http://")) {
          console.log("📥 Usando URL pública diretamente:", finalUrl)
        } else {
          console.log("📥 Usando proxy para URL local:", finalUrl)
          console.warn("⚠️ URLs locais podem não funcionar com Google Maps KmlLayer")
        }

        console.log("📎 URL final para KML layer:", finalUrl)

        // Create new KML layer
        // IMPORTANTE: preserveViewport: true para não ajustar automaticamente cada layer
        // Vamos ajustar manualmente quando todos os layers estiverem carregados
        const kmlLayer = new google.maps.KmlLayer({
          url: finalUrl,
          map: map,
          preserveViewport: true, // Não ajustar automaticamente - vamos fazer manualmente
          suppressInfoWindows: false, // Show info windows on click
        })

        kmlLayersRef.current.set(kmlUrl, kmlLayer)

        // Handle KML layer load
        kmlLayer.addListener("status_changed", () => {
          const status = kmlLayer.getStatus()
          console.log("📊 Status do KML:", kmlUrl, status)
          
          if (status === google.maps.KmlLayerStatus.OK) {
            console.log("✅ KML carregado com sucesso:", kmlUrl)
            
            // Verificar se o layer está realmente no mapa
            if (kmlLayer.getMap() === null) {
              console.error("❌ KML Layer não está associado ao mapa!")
              kmlLayer.setMap(map)
            }
            
            loadedCount++
            
            // Quando todos os KMLs estiverem carregados, ajustar o viewport
            if (loadedCount === totalKmls) {
              setTimeout(() => {
                // Coletar todos os viewports dos layers carregados
                const allBounds = new google.maps.LatLngBounds()
                let hasValidBounds = false
                
                kmlLayersRef.current.forEach((layer) => {
                  const viewport = layer.getDefaultViewport()
                  if (viewport) {
                    allBounds.union(viewport)
                    hasValidBounds = true
                  }
                })
                
                if (hasValidBounds) {
                  console.log("📍 Ajustando viewport para todos os KMLs")
                  map.fitBounds(allBounds, { padding: 50 })
                  
                  setTimeout(() => {
                    google.maps.event.trigger(map, "resize")
                    map.fitBounds(allBounds, { padding: 50 })
                    console.log("🔄 Viewport ajustado para múltiplos KMLs")
                  }, 500)
                }
              }, 800)
            }
          } else if (status === google.maps.KmlLayerStatus.ERROR) {
            console.error("❌ Erro ao carregar KML:", kmlUrl, status)
            loadedCount++ // Contar como carregado para não travar
          } else if (status === google.maps.KmlLayerStatus.LOADING) {
            console.log("⏳ KML ainda carregando...", kmlUrl)
          } else if (status === google.maps.KmlLayerStatus.DOCUMENT_NOT_FOUND) {
            console.error("❌ Documento KML não encontrado:", kmlUrl)
            loadedCount++
          } else if (status === google.maps.KmlLayerStatus.FETCH_ERROR) {
            console.error("❌ Erro ao buscar KML:", kmlUrl)
            loadedCount++
          } else if (status === google.maps.KmlLayerStatus.INVALID_DOCUMENT) {
            console.error("❌ Documento KML inválido:", kmlUrl)
            loadedCount++
          } else if (status === google.maps.KmlLayerStatus.INVALID_REQUEST) {
            console.error("❌ Requisição inválida:", kmlUrl)
            loadedCount++
          } else if (status === google.maps.KmlLayerStatus.LIMITS_EXCEEDED) {
            console.error("❌ Limites excedidos:", kmlUrl)
            loadedCount++
          } else if (status === google.maps.KmlLayerStatus.TIMED_OUT) {
            console.error("❌ Timeout ao carregar KML:", kmlUrl)
            loadedCount++
          }
        })
        
        // Adicionar listener para quando o KML for totalmente carregado
        kmlLayer.addListener("defaultviewport_changed", () => {
          console.log("🔄 DefaultViewport mudou - KML totalmente processado:", kmlUrl)
          // Recalcular bounds quando um viewport mudar
          const allBounds = new google.maps.LatLngBounds()
          let hasValidBounds = false
          
          kmlLayersRef.current.forEach((layer) => {
            const viewport = layer.getDefaultViewport()
            if (viewport) {
              allBounds.union(viewport)
              hasValidBounds = true
            }
          })
          
          if (hasValidBounds) {
            map.fitBounds(allBounds, { padding: 50 })
          }
        })

        // Handle click on KML features
        kmlLayer.addListener("click", (event: google.maps.KmlMouseEvent) => {
          if (event.featureData) {
            console.log("🖱️ Feature clicada:", event.featureData)
            const loteId = event.featureData.id || event.featureData.name
            handleLoteSelect(loteId || null)
          }
        })
      })
    }

    // Aguardar mais tempo após o upload para garantir que o servidor processou completamente
    const timeoutId = setTimeout(() => {
      loadKmls()
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      // Limpar todos os layers ao desmontar
      kmlLayersRef.current.forEach((layer) => {
        layer.setMap(null)
      })
      kmlLayersRef.current.clear()
    }
  }, [map, kmlUrls, isLoaded, isLoading, handleLoteSelect])

  if (loadError) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          height: "100%",
          minHeight: 500,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Box sx={{ color: "error.main", mb: 2 }}>
            Erro ao carregar Google Maps
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {loadError.message || "Verifique se a API key do Google Maps está configurada"}
          </Box>
        </Box>
      </Paper>
    )
  }

  if (!isLoaded) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          height: "100%",
          minHeight: 500,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 500,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.SATELLITE,
              google.maps.MapTypeId.HYBRID,
              google.maps.MapTypeId.TERRAIN,
            ],
          },
          streetViewControl: false, // Desabilitar para não interferir com o KML
          fullscreenControl: true,
          zoomControl: true,
          disableDefaultUI: false,
        }}
      >
        {/* KML Layer will be added via useEffect */}
      </GoogleMap>

      {(isLoading || !kmlUrls || kmlUrls.length === 0) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.7)",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  )
}
