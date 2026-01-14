import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

/**
 * Rota para servir arquivos KML diretamente do public
 * Esta rota serve os KMLs com headers corretos para o Google Maps
 * Uso: /api/kml/public?path=/kml/mapas-gerais/localizacao-chacaras-fazenda-teixeira.kml
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json(
        { error: "Parâmetro 'path' é obrigatório" },
        { status: 400 }
      )
    }

    // Validar que o path está dentro do public (segurança)
    const publicPath = join(process.cwd(), "public", path)
    const publicDir = join(process.cwd(), "public")
    
    if (!publicPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Caminho inválido" },
        { status: 400 }
      )
    }

    // Verificar se o arquivo existe
    if (!existsSync(publicPath)) {
      return NextResponse.json(
        { error: "Arquivo KML não encontrado" },
        { status: 404 }
      )
    }

    // Ler o arquivo
    const kmlContent = await readFile(publicPath, "utf-8")

    // Validar se é um KML válido
    if (!kmlContent.includes("<?xml") && !kmlContent.includes("<kml")) {
      return NextResponse.json(
        { error: "Conteúdo KML inválido" },
        { status: 400 }
      )
    }

    // Retornar o KML com headers apropriados para o Google Maps
    return new NextResponse(kmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.google-earth.kml+xml",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600", // Cache por 1 hora
      },
    })
  } catch (error) {
    console.error("Erro ao servir KML do public:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
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
