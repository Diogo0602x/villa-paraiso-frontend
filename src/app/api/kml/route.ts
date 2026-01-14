import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const kmlUrl = searchParams.get("url")
  const path = searchParams.get("path") // Aceitar path diretamente também

  // Se path foi fornecido diretamente, usar isso (mais eficiente)
  if (path) {
    try {
      const publicPath = join(process.cwd(), "public", path)
      const publicDir = join(process.cwd(), "public")
      
      console.log("📂 Path fornecido diretamente:", path)
      console.log("📂 Tentando ler arquivo:", publicPath)
      
      // Validar segurança
      if (!publicPath.startsWith(publicDir)) {
        console.error("❌ Caminho inválido (fora do public):", publicPath)
        return NextResponse.json({ error: "Caminho inválido" }, { status: 400 })
      }

      if (!existsSync(publicPath)) {
        console.error("❌ Arquivo não encontrado:", publicPath)
        return NextResponse.json({ error: "Arquivo KML não encontrado" }, { status: 404 })
      }

      const kmlContent = await readFile(publicPath, "utf-8")
      console.log("✅ KML lido do public, tamanho:", kmlContent.length, "caracteres")

      return new NextResponse(kmlContent, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.google-earth.kml+xml",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "public, max-age=3600",
        },
      })
    } catch (error) {
      console.error("❌ Erro ao ler KML do path:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Erro desconhecido" },
        { status: 500 },
      )
    }
  }

  if (!kmlUrl) {
    return NextResponse.json({ error: "URL do KML ou path é obrigatório" }, { status: 400 })
  }

  try {
    console.log("🔍 Proxy KML recebeu URL:", kmlUrl)
    
    // Se a URL for uma rota interna (/api/kml/public), extrair o path e servir diretamente
    if (kmlUrl.includes("/api/kml/public")) {
      console.log("📂 Detectada rota interna /api/kml/public")
      let path: string | null = null
      
      // Tentar extrair path de diferentes formatos de URL
      try {
        const urlObj = new URL(kmlUrl)
        path = urlObj.searchParams.get("path")
        console.log("📂 Path extraído da URL:", path)
      } catch (urlError) {
        // Se falhar, tentar parsear manualmente
        const pathMatch = kmlUrl.match(/path=([^&]+)/)
        if (pathMatch) {
          path = decodeURIComponent(pathMatch[1])
          console.log("📂 Path extraído manualmente:", path)
        }
      }
      
      if (path) {
        // Servir diretamente do public
        const publicPath = join(process.cwd(), "public", path)
        const publicDir = join(process.cwd(), "public")
        
        console.log("📂 Tentando ler arquivo:", publicPath)
        
        // Validar segurança
        if (!publicPath.startsWith(publicDir)) {
          console.error("❌ Caminho inválido (fora do public):", publicPath)
          return NextResponse.json({ error: "Caminho inválido" }, { status: 400 })
        }

        if (!existsSync(publicPath)) {
          console.error("❌ Arquivo não encontrado:", publicPath)
          return NextResponse.json({ error: "Arquivo KML não encontrado" }, { status: 404 })
        }

        const kmlContent = await readFile(publicPath, "utf-8")
        console.log("✅ KML lido do public, tamanho:", kmlContent.length, "caracteres")

        return new NextResponse(kmlContent, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.google-earth.kml+xml",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Cache-Control": "public, max-age=3600",
          },
        })
      } else {
        console.warn("⚠️ Não conseguiu extrair path da URL:", kmlUrl)
      }
    }

    // Se a URL for localhost, tentar extrair o path se for uma rota interna
    if (kmlUrl.includes("localhost") || kmlUrl.includes("127.0.0.1")) {
      console.log("🔍 Detectada URL localhost, tentando extrair path...")
      // Tentar extrair path de URLs como: http://localhost:3000/api/kml/public?path=...
      try {
        const urlObj = new URL(kmlUrl)
        if (urlObj.pathname === "/api/kml/public") {
          const path = urlObj.searchParams.get("path")
          if (path) {
            const publicPath = join(process.cwd(), "public", path)
            const publicDir = join(process.cwd(), "public")
            
            console.log("📂 Path extraído de localhost:", path)
            console.log("📂 Tentando ler:", publicPath)
            
            if (publicPath.startsWith(publicDir) && existsSync(publicPath)) {
              const kmlContent = await readFile(publicPath, "utf-8")
              console.log("✅ KML lido do public via localhost, tamanho:", kmlContent.length)
              
              return new NextResponse(kmlContent, {
                status: 200,
                headers: {
                  "Content-Type": "application/vnd.google-earth.kml+xml",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Cache-Control": "public, max-age=3600",
                },
              })
            }
          }
        }
      } catch (urlError) {
        // Se não conseguir parsear, continuar com fetch normal
        console.warn("⚠️ Não conseguiu parsear URL localhost:", urlError)
      }
    }

    // Para URLs externas ou outras situações, fazer fetch normalmente
    const response = await fetch(kmlUrl, {
      headers: {
        "Accept": "application/vnd.google-earth.kml+xml, application/xml, text/xml",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao carregar KML: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const kmlText = await response.text()

    // Retornar o KML com headers apropriados
    return new NextResponse(kmlText, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.google-earth.kml+xml",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Erro ao fazer proxy do KML:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
