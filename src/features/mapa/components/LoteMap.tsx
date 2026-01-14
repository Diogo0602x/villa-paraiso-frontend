"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Box, Paper, CircularProgress } from "@mui/material"
import type { GeoJsonCollection, GeoJsonFeature } from "@/types"
import { StatusLote } from "@/enums"
import { createRoot } from "react-dom/client"
import { MapPopupContent } from "./MapPopup"
import { useRouter } from "next/navigation"
import type maplibregl from "maplibre-gl"
import toGeoJSON from "@mapbox/togeojson"

const MAP_DEFAULT_CENTER: [number, number] = [-15.7801, -47.9292] // Brasília
const MAP_DEFAULT_ZOOM = 10
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

interface LoteMapProps {
  geojson: GeoJsonCollection | undefined
  isLoading: boolean
  selectedLoteId?: string | number | null
  onLoteSelect?: (loteId: string | number | null) => void
  kmlUrl?: string | null
}

export function LoteMap({ geojson, isLoading, selectedLoteId, onLoteSelect, kmlUrl }: LoteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const popup = useRef<maplibregl.Popup | null>(null)
  const router = useRouter()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [maplibreModule, setMaplibreModule] = useState<typeof maplibregl | null>(null)
  const [kmlGeoJson, setKmlGeoJson] = useState<GeoJsonCollection | null>(null)
  const [isLoadingKml, setIsLoadingKml] = useState(false)

  // Ensure component only renders on client and load maplibre dynamically
  useEffect(() => {
    setIsMounted(true)
    // Dynamically import maplibre-gl and CSS only on client
    Promise.all([
      import("maplibre-gl"),
      import("maplibre-gl/dist/maplibre-gl.css"),
    ]).then(([maplibre]) => {
      setMaplibreModule(maplibre.default)
    })
  }, [])

  // Load and process KML when kmlUrl is provided
  useEffect(() => {
    if (!kmlUrl) {
      setKmlGeoJson(null)
      return
    }

    const loadKml = async () => {
      setIsLoadingKml(true)
      try {
        console.log("🔄 Iniciando carregamento do KML:", kmlUrl)
        
        // Fetch KML file através do proxy da API para evitar CORS
        const proxyUrl = `/api/kml?url=${encodeURIComponent(kmlUrl)}`
        const response = await fetch(proxyUrl, {
          method: "GET",
          headers: {
            "Accept": "application/vnd.google-earth.kml+xml, application/xml, text/xml",
          },
        })
        
        console.log("📥 Resposta do GET KML:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        })
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar KML: ${response.status} ${response.statusText}`)
        }

        const kmlText = await response.text()
        console.log("📄 KML carregado, tamanho:", kmlText.length, "caracteres")
        
        // Parse KML XML using browser's native DOMParser
        const parser = new DOMParser()
        const kmlDoc = parser.parseFromString(kmlText, "text/xml")
        
        // Check for parsing errors
        const parseError = kmlDoc.querySelector("parsererror")
        if (parseError) {
          throw new Error("Erro ao processar XML do KML")
        }

        // Convert KML to GeoJSON
        const geoJson = toGeoJSON.kml(kmlDoc as any) as GeoJsonCollection
        console.log("🗺️ KML convertido para GeoJSON:", {
          totalFeatures: geoJson.features.length,
          featureTypes: geoJson.features.map(f => f.geometry.type),
        })
        
        // Process features to extract information from KML placemarks
        const processedFeatures = geoJson.features.map((feature, index) => {
          // Try to extract name from KML properties
          const name = (feature.properties as any)?.name || `Lote ${index + 1}`
          
          // Extract description/HTML if available
          const description = (feature.properties as any)?.description || ""
          
          // Parse description HTML to extract useful info
          let parsedInfo: Record<string, any> = {}
          if (description) {
            try {
              const descParser = new DOMParser()
              const descDoc = descParser.parseFromString(`<div>${description}</div>`, "text/html")
              const textContent = descDoc.documentElement.textContent || ""
              
              // Try to extract basic info from text
              parsedInfo = {
                description: textContent,
                rawDescription: description,
              }
            } catch (e) {
              parsedInfo = { description }
            }
          }

          return {
            ...feature,
            id: feature.id || `kml-${index}`,
            properties: {
              ...feature.properties,
              loteId: feature.id || `kml-${index}`,
              numero: name,
              name,
              ...parsedInfo,
              // Default values for compatibility
              status: StatusLote.DISPONIVEL,
              setor: {
                id: "",
                nome: "KML",
                slug: "kml",
              },
              cor: "#4CAF50",
            },
          }
        })

        setKmlGeoJson({
          ...geoJson,
          features: processedFeatures,
        })

        console.log("KML carregado com sucesso:", {
          features: processedFeatures.length,
          sample: processedFeatures[0],
        })
      } catch (error) {
        console.error("Erro ao processar KML:", error)
        setKmlGeoJson(null)
      } finally {
        setIsLoadingKml(false)
      }
    }

    loadKml()
  }, [kmlUrl])

  // Initialize map - only on client
  useEffect(() => {
    if (!isMounted || !maplibreModule || !mapContainer.current || map.current) return

    map.current = new maplibreModule.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
    })

    map.current.addControl(new maplibreModule.NavigationControl(), "top-right")
    map.current.addControl(
      new maplibreModule.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
    )

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isMounted, maplibreModule])

  // Handle popup for lote
  const showPopup = useCallback(
    (feature: GeoJsonFeature, lngLat: any) => {
      if (!map.current || !maplibreModule) return

      // Remove existing popup
      if (popup.current) {
        popup.current.remove()
      }

      // Create popup container
      const popupContainer = document.createElement("div")
      const root = createRoot(popupContainer)

      root.render(
        <MapPopupContent
          feature={feature.properties}
          onViewDetails={() => {
            // Navigate to venda if sold, otherwise show lote details
            if (feature.properties.status === StatusLote.VENDIDO) {
              router.push(`/vendas?setorSlug=${feature.properties.setor?.slug || ""}`)
            } else {
              router.push(`/admin`)
            }
            popup.current?.remove()
          }}
        />,
      )

      popup.current = new maplibreModule.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: "300px",
      })
        .setLngLat(lngLat)
        .setDOMContent(popupContainer)
        .addTo(map.current)
    },
    [router, maplibreModule],
  )

  // Update map data when geojson or kmlGeoJson changes
  useEffect(() => {
    if (!isMounted || !map.current || !mapLoaded || !maplibreModule) return

    // Use KML GeoJSON if available, otherwise use regular geojson
    const activeGeoJson = kmlGeoJson || geojson
    if (!activeGeoJson) return

    const mapInstance = map.current

    // Remove existing event listeners to prevent duplication
    mapInstance.off("click", "lotes-fill")
    mapInstance.off("mousemove", "lotes-fill")
    mapInstance.off("mouseleave", "lotes-fill")
    mapInstance.off("click", "lotes-circles")
    mapInstance.off("mousemove", "lotes-circles")
    mapInstance.off("mouseleave", "lotes-circles")

    // Remove existing layers and source if they exist
    const layersToRemove = [
      "lotes-fill",
      "lotes-outline",
      "lotes-circles",
      "lotes-circles-outline",
      "lotes-labels",
    ]

    layersToRemove.forEach((layerId) => {
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId)
      }
    })

    if (mapInstance.getSource("lotes")) {
      mapInstance.removeSource("lotes")
    }

    // Process all features - support both Points and Polygons
    // API may return Points (when polygons not available) or Polygons (when available)
    const validFeatures = activeGeoJson.features
      .filter((feature) => {
        // Skip empty GeometryCollection
        if (feature.geometry.type === "GeometryCollection") {
          const coords = feature.geometry.coordinates as []
          return coords && coords.length > 0
        }
        // Accept Point, Polygon, and MultiPolygon
        return (
          feature.geometry.type === "Point" ||
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        )
      })
      .map((feature) => {
        // Enrich feature with color property for easier access in MapLibre expressions
        // Priority: cor (direct), setor.cor, or default gray
        const color = feature.properties.cor || feature.properties.setor?.cor || "#cccccc"
        
        // Ensure we have a valid color (hex format)
        const normalizedColor = color.startsWith("#") ? color : `#${color}`
        
        return {
          ...feature,
          id: feature.id || feature.properties.loteId || String(feature.properties.numero || ""), // Ensure id is set for feature state
          properties: {
            ...feature.properties,
            _color: normalizedColor, // Add color as direct property for MapLibre expressions
          },
        }
      })

    const filteredGeoJson = {
      ...activeGeoJson,
      features: validFeatures,
    }

    // Add the source
    mapInstance.addSource("lotes", {
      type: "geojson",
      data: filteredGeoJson,
    })

    // Separate features by geometry type
    const polygonFeatures = validFeatures.filter(
      (f) => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon",
    )
    const pointFeatures = validFeatures.filter((f) => f.geometry.type === "Point")

    // Debug: Log geometry types received
    console.log("Map Debug - Geometry Types:", {
      total: validFeatures.length,
      polygons: polygonFeatures.length,
      points: pointFeatures.length,
      sampleFeature: validFeatures[0] ? {
        type: validFeatures[0].geometry.type,
        numero: validFeatures[0].properties.numero,
        hasCoordenadas: !!validFeatures[0].properties,
      } : null,
    })

    // Add fill layers for Polygon geometries
    if (polygonFeatures.length > 0) {
      // Fill layer
      mapInstance.addLayer({
        id: "lotes-fill",
        type: "fill",
        source: "lotes",
        filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
        paint: {
          "fill-color": ["get", "_color"],
          "fill-opacity": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            0.85, // Slightly more transparent to show boundaries better
            ["boolean", ["feature-state", "hover"], false],
            0.75,
            0.65, // More transparent to make boundaries stand out
          ],
        },
      })

      // Outline layer for polygons - thicker, more visible borders
      mapInstance.addLayer({
        id: "lotes-outline",
        type: "line",
        source: "lotes",
        filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            "#1D4F29", // Dark green for selected
            ["boolean", ["feature-state", "hover"], false],
            "#000000", // Black for hover
            "#000000", // Black for all borders - maximum visibility
          ],
          "line-width": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            4, // Thicker for selected
            ["boolean", ["feature-state", "hover"], false],
            3, // Thicker for hover
            2, // Thicker default - better visibility of lot boundaries
          ],
          "line-opacity": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            1.0,
            ["boolean", ["feature-state", "hover"], false],
            1.0,
            0.9, // High opacity for clear boundaries
          ],
        },
      })

      // Click handler for polygons
      mapInstance.on("click", "lotes-fill", (e) => {
        if (!e.features || e.features.length === 0) return

        const feature = e.features[0] as unknown as GeoJsonFeature
        const loteId = feature.properties.loteId || feature.id
        onLoteSelect?.(loteId || null)
        showPopup(feature, e.lngLat)
      })

      // Hover effects for polygons
      let hoveredPolygonId: string | null = null

      mapInstance.on("mousemove", "lotes-fill", (e) => {
        if (!e.features || e.features.length === 0) return

        mapInstance.getCanvas().style.cursor = "pointer"

        const feature = e.features[0] as unknown as GeoJsonFeature
        const id = feature.properties?.loteId || feature.id

        if (hoveredPolygonId !== null && hoveredPolygonId !== id) {
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPolygonId }, { hover: false })
        }

        if (id !== undefined) {
          hoveredPolygonId = String(id)
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPolygonId }, { hover: true })
        }
      })

      mapInstance.on("mouseleave", "lotes-fill", () => {
        mapInstance.getCanvas().style.cursor = ""
        if (hoveredPolygonId !== null) {
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPolygonId }, { hover: false })
          hoveredPolygonId = null
        }
      })
    }

    // Add circle layers for Point geometries (when polygons are not available)
    if (pointFeatures.length > 0) {
      // Circle layer for points
      mapInstance.addLayer({
        id: "lotes-circles",
        type: "circle",
        source: "lotes",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-color": ["get", "_color"],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            5,
            15,
            8,
            20,
            12,
          ],
          "circle-opacity": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            0.9,
            ["boolean", ["feature-state", "hover"], false],
            0.8,
            0.7,
          ],
          "circle-stroke-color": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            "#1D4F29",
            ["boolean", ["feature-state", "hover"], false],
            "#000000",
            "#333333",
          ],
          "circle-stroke-width": [
            "case",
            ["==", ["get", "loteId"], selectedLoteId ? String(selectedLoteId) : ""],
            3,
            ["boolean", ["feature-state", "hover"], false],
            2,
            1.5,
          ],
        },
      })

      // Click handler for points
      mapInstance.on("click", "lotes-circles", (e) => {
        if (!e.features || e.features.length === 0) return

        const feature = e.features[0] as unknown as GeoJsonFeature
        const loteId = feature.properties.loteId || feature.id
        onLoteSelect?.(loteId || null)
        showPopup(feature, e.lngLat)
      })

      // Hover effects for points
      let hoveredPointId: string | null = null

      mapInstance.on("mousemove", "lotes-circles", (e) => {
        if (!e.features || e.features.length === 0) return

        mapInstance.getCanvas().style.cursor = "pointer"

        const feature = e.features[0] as unknown as GeoJsonFeature
        const id = feature.properties?.loteId || feature.id

        if (hoveredPointId !== null && hoveredPointId !== id) {
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPointId }, { hover: false })
        }

        if (id !== undefined) {
          hoveredPointId = String(id)
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPointId }, { hover: true })
        }
      })

      mapInstance.on("mouseleave", "lotes-circles", () => {
        mapInstance.getCanvas().style.cursor = ""
        if (hoveredPointId !== null) {
          mapInstance.setFeatureState({ source: "lotes", id: hoveredPointId }, { hover: false })
          hoveredPointId = null
        }
      })
    }

    // Add labels layer for all features
    mapInstance.addLayer({
      id: "lotes-labels",
      type: "symbol",
      source: "lotes",
      layout: {
        "text-field": ["get", "numero"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          10,
          15,
          12,
          20,
          16,
        ],
        "text-anchor": "center",
        "text-allow-overlap": false,
        "text-ignore-placement": false,
      },
      paint: {
        "text-color": "#333333",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    })

    // Fit bounds to data if we have valid features
    if (validFeatures.length > 0) {
      const bounds = new maplibreModule.LngLatBounds()

      validFeatures.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates as number[][][]
          if (coords[0] && coords[0].length > 0) {
            coords[0].forEach((coord) => {
              if (coord && coord.length >= 2) {
                bounds.extend([coord[0], coord[1]] as [number, number])
              }
            })
          }
        } else if (feature.geometry.type === "MultiPolygon") {
          const coords = feature.geometry.coordinates as number[][][][]
          coords.forEach((polygon) => {
            if (polygon[0] && polygon[0].length > 0) {
              polygon[0].forEach((coord) => {
                if (coord && coord.length >= 2) {
                  bounds.extend([coord[0], coord[1]] as [number, number])
                }
              })
            }
          })
        } else if (feature.geometry.type === "LineString") {
          const coords = feature.geometry.coordinates as number[][]
          if (coords && coords.length > 0) {
            coords.forEach((coord) => {
              if (coord && coord.length >= 2) {
                bounds.extend([coord[0], coord[1]] as [number, number])
              }
            })
          }
        } else if (feature.geometry.type === "Point") {
          const coord = feature.geometry.coordinates as number[]
          if (coord && coord.length >= 2) {
            bounds.extend([coord[0], coord[1]] as [number, number])
          }
        }
      })

      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds, {
          padding: 50,
          maxZoom: 16,
        })
      }
    }
  }, [isMounted, maplibreModule, geojson, kmlGeoJson, mapLoaded, selectedLoteId, onLoteSelect, showPopup])

  // Don't render map container until mounted on client and maplibre is loaded
  if (!isMounted || !maplibreModule) {
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
      <Box ref={mapContainer} sx={{ width: "100%", height: "100%" }} />

      {(isLoading || isLoadingKml) && (
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
