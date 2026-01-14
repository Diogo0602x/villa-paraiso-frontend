import { api } from "./apiClient"
import type { Venda, VendaCreate, VendaUpdate, GetVendasParams, Lote } from "@/types"
import { StatusLote } from "@/enums"

// Helper para extrair forma de pagamento dos campos disponíveis
function extractFormaPagamento(lote: Lote): string | undefined {
  // Se houver parcelamento, provavelmente é parcelado
  if (lote.parcelamento_venda) {
    if (lote.parcelamento_venda.toLowerCase().includes("parcela")) {
      return "Parcelado"
    }
  }
  
  // Tentar extrair de observacoes_venda
  if (lote.observacoes_venda) {
    const obs = lote.observacoes_venda.toLowerCase()
    if (obs.includes("à vista") || obs.includes("a vista")) return "À vista"
    if (obs.includes("parcelado")) return "Parcelado"
    if (obs.includes("financiamento")) return "Financiamento"
  }
  
  return undefined
}

// Helper para converter Lote em Venda usando campos estruturados
function parseVendaFromLote(lote: Lote): Venda {
  const venda: Venda = {
    id: lote.id,
    lote_id: lote.id,
    numero: lote.numero,
    setor_id: lote.setor_id,
    setor: lote.setor || null,
    status: lote.status,
    tem_acesso_agua: lote.tem_acesso_agua,
    frente_br060: lote.frente_br060,
    area: lote.area,
    observacoes: lote.observacoes,
    // Campos estruturados de venda
    comprador: lote.comprador,
    valor_total_venda: lote.valor_total_venda,
    entrada_venda: lote.entrada_venda,
    parcelamento_venda: lote.parcelamento_venda,
    observacoes_venda: lote.observacoes_venda,
    // Aliases para compatibilidade
    valor_total: lote.valor_total_venda || undefined,
    entrada: lote.entrada_venda || undefined,
    parcelamento: lote.parcelamento_venda || undefined,
    // Tentar extrair forma_pagamento de parcelamento_venda ou observacoes_venda
    forma_pagamento: extractFormaPagamento(lote),
  }

  return venda
}

export interface VendasFilters extends GetVendasParams {}

export const vendasApi = {
  // Lista todas as vendas (lotes vendidos)
  getAll: (filters?: VendasFilters) => {
    const params = new URLSearchParams()
    if (filters?.setor_id) params.set("setor_id", filters.setor_id)
    if (filters?.setor_slug) params.set("setor_slug", filters.setor_slug)
    if (filters?.numero) params.set("numero", filters.numero)

    const query = params.toString()
    return api
      .get<Lote[]>(`/api/lotes/filtros/vendidos${query ? `?${query}` : ""}`)
      .then((response) => response.map(parseVendaFromLote))
  },

  // Busca uma venda específica por ID do lote
  getById: (id: string) => {
    return api.get<Lote>(`/api/lotes/${id}`).then((lote) => {
      if (lote.status !== StatusLote.VENDIDO) {
        throw new Error("Lote não está vendido")
      }
      return parseVendaFromLote(lote)
    })
  },

  // Cria uma nova venda (registra venda de um lote)
  create: (data: VendaCreate) => {
    return api
      .post<Lote>(`/api/lotes/${data.lote_id}/venda`, {
        comprador: data.comprador,
        valor_total: data.valor_total,
        forma_pagamento: data.forma_pagamento,
        entrada: data.entrada,
        parcelamento: data.parcelamento,
        observacoes_venda: data.observacoes_venda,
      })
      .then(parseVendaFromLote)
  },

  // Atualiza informações da venda usando endpoint de venda
  update: (id: string, data: VendaUpdate) => {
    // Primeiro, buscar o lote para preservar informações existentes
    return api.get<Lote>(`/api/lotes/${id}`).then((lote) => {
      if (lote.status !== StatusLote.VENDIDO) {
        throw new Error("Lote não está vendido")
      }

      // Construir dados de venda atualizados, preservando valores existentes
      const vendaData = {
        comprador: data.comprador ?? lote.comprador ?? "",
        valor_total: data.valor_total ?? lote.valor_total_venda ?? 0,
        forma_pagamento: data.forma_pagamento || extractFormaPagamento(lote) || "",
        entrada: data.entrada ?? lote.entrada_venda,
        parcelamento: data.parcelamento ?? lote.parcelamento_venda,
        observacoes_venda: data.observacoes_venda ?? lote.observacoes_venda,
      }
      
      // Atualizar usando o endpoint de venda
      return api
        .post<Lote>(`/api/lotes/${id}/venda`, vendaData)
        .then(parseVendaFromLote)
    })
  },

  // Deleta uma venda (muda status do lote de volta para DISPONIVEL)
  // Nota: Isso não deleta o lote, apenas reverte o status e limpa campos de venda
  delete: (id: string) => {
    return api.put<Lote>(`/api/lotes/${id}`, {
      status: StatusLote.DISPONIVEL,
      // Os campos de venda serão limpos automaticamente pelo backend ao mudar o status
    })
  },
}
