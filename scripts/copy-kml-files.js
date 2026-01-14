/**
 * Script to copy KML files from mapeamento folder to public/kml
 * Run with: node scripts/copy-kml-files.js
 */

const fs = require("fs")
const path = require("path")

const sourceDir = path.join(__dirname, "..", "mapeamento")
const targetDir = path.join(__dirname, "..", "public", "kml")

// Create target directories
const setoresDir = path.join(targetDir, "setores")
const mapasGeraisDir = path.join(targetDir, "mapas-gerais")

if (!fs.existsSync(setoresDir)) {
  fs.mkdirSync(setoresDir, { recursive: true })
}
if (!fs.existsSync(mapasGeraisDir)) {
  fs.mkdirSync(mapasGeraisDir, { recursive: true })
}

// Copy general map
const generalMapSource = path.join(
  sourceDir,
  "mapas-gerais",
  "mapa-topografico-finalizado",
  "mapa-topografico-finalizado.kml",
)
const generalMapTarget = path.join(mapasGeraisDir, "mapa-geral.kml")

if (fs.existsSync(generalMapSource)) {
  fs.copyFileSync(generalMapSource, generalMapTarget)
  console.log(`✓ Copied: ${generalMapTarget}`)
} else {
  console.warn(`⚠ Not found: ${generalMapSource}`)
}

// Copy arquivos-gerais KML
const arquivosGeraisSource = path.join(
  sourceDir,
  "arquivos-gerais",
  "localizacao-chacaras-fazenda-teixeira.kml",
)
const arquivosGeraisTarget = path.join(mapasGeraisDir, "localizacao-chacaras-fazenda-teixeira.kml")

if (fs.existsSync(arquivosGeraisSource)) {
  fs.copyFileSync(arquivosGeraisSource, arquivosGeraisTarget)
  console.log(`✓ Copied: ${arquivosGeraisTarget}`)
} else {
  console.warn(`⚠ Not found: ${arquivosGeraisSource}`)
}

// Copy setor KMLs
const setores = [
  "setor-aguas-do-cerrado",
  "setor-ipe-roxo",
  "setor-montes-claros",
  "setor-portal-do-cerrado",
  "setor-riacho-dourado",
  "setor-vale-do-pequi",
  "setor-vista-do-sol",
]

setores.forEach((setor) => {
  const source = path.join(sourceDir, "setores", setor, `${setor}.kml`)
  const target = path.join(setoresDir, `${setor}.kml`)

  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target)
    console.log(`✓ Copied: ${target}`)
  } else {
    console.warn(`⚠ Not found: ${source}`)
  }
})

console.log("\n✅ KML files copied successfully!")
