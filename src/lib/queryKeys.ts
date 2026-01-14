// Query keys factory for consistent cache invalidation

export const queryKeys = {
  setores: {
    all: ["setores"] as const,
    bySlug: (slug: string) => ["setores", "slug", slug] as const,
    lotes: (slug: string) => ["setores", "slug", slug, "lotes"] as const,
  },
  lotes: {
    all: ["lotes"] as const,
    list: (filters?: Record<string, unknown>) => ["lotes", "list", filters || {}] as const,
    byId: (id: string | number) => ["lotes", id] as const,
    bySetor: (setorSlug: string) => ["lotes", "setor", setorSlug] as const,
  },
  vendas: {
    all: ["vendas"] as const,
    list: (filters?: Record<string, unknown>) => ["vendas", "list", filters || {}] as const,
    byId: (id: number) => ["vendas", id] as const,
  },
  parcelas: {
    all: ["parcelas"] as const,
    list: (filters?: Record<string, unknown>) => ["parcelas", "list", filters || {}] as const,
    byId: (id: number) => ["parcelas", id] as const,
    byVenda: (vendaId: number) => ["parcelas", "venda", vendaId] as const,
  },
  pagamentos: {
    all: ["pagamentos"] as const,
    list: (filters?: Record<string, unknown>) => ["pagamentos", "list", filters || {}] as const,
    byId: (id: number) => ["pagamentos", id] as const,
    byParcela: (parcelaId: number) => ["pagamentos", "parcela", parcelaId] as const,
  },
  dividasEmpresa: {
    all: ["dividas-empresa"] as const,
    ativas: ["dividas-empresa", "ativas"] as const,
    total: ["dividas-empresa", "total"] as const,
    byId: (id: number) => ["dividas-empresa", id] as const,
  },
  estatisticas: {
    geral: ["estatisticas", "geral"] as const,
    faturamento: (ano: number, mes?: number) =>
      ["estatisticas", "faturamento", ano, mes] as const,
    dividas: (filters?: Record<string, unknown>) =>
      ["estatisticas", "dividas", filters || {}] as const,
  },
  mapas: {
    geojson: (filters?: Record<string, unknown>) => ["mapas", "geojson", filters || {}] as const,
    geojsonSetor: (slug: string, filters?: Record<string, unknown>) =>
      ["mapas", "geojson", "setor", slug, filters || {}] as const,
    geojsonLote: (id: number) => ["mapas", "geojson", "lote", id] as const,
  },
  clientes: {
    all: ["clientes"] as const,
    byName: (nome: string) => ["clientes", "nome", nome] as const,
  },
}
