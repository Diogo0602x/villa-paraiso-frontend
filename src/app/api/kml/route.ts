import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const kmlUrl = searchParams.get("url")

  if (!kmlUrl) {
    return NextResponse.json({ error: "URL do KML é obrigatória" }, { status: 400 })
  }

  try {
    // Fazer fetch do KML no servidor (sem problemas de CORS)
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
        "Access-Control-Allow-Methods": "GET",
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
