"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { vendasApi } from "@/services/vendasApi"
import type { Venda } from "@/types"

export interface Cliente {
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  valorPendente: number
  valorTotal: number
  valorPago: number
  parcelasAtrasadas: number
  totalVendas: number
}

export interface ClienteDetail {
  nome: string
  cpf?: string
  telefone?: string
  email?: string
  valorPendente: number
  valorTotal: number
  valorPago: number
  parcelasAtrasadas: number
  totalVendas: number
  vendas: Venda[]
}

export function useClientes(searchTerm?: string) {
  return useQuery({
    queryKey: queryKeys.clientes.all,
    queryFn: async () => {
      const vendasResponse = await vendasApi.getAll()
      const vendas = vendasResponse?.data || []
      
      // Agrupar vendas por comprador
      const clientesMap = new Map<string, Cliente>()
      
      for (const venda of vendas) {
        const nome = venda.compradorNome
        if (!clientesMap.has(nome)) {
          clientesMap.set(nome, {
            nome,
            cpf: venda.compradorCpf,
            telefone: venda.compradorTelefone,
            email: venda.compradorEmail,
            valorPendente: 0,
            valorTotal: 0,
            valorPago: 0,
            parcelasAtrasadas: 0,
            totalVendas: 0,
          })
        }
        
        const cliente = clientesMap.get(nome)!
        cliente.totalVendas += 1
        cliente.valorTotal += venda.valorTotal
        
        // Calcular valor pendente, pago e parcelas atrasadas
        if (venda.parcelas) {
          for (const parcela of venda.parcelas) {
            const totalPago = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
            const valorPendente = parcela.valor - totalPago
            
            cliente.valorPago += totalPago
            
            if (valorPendente > 0) {
              cliente.valorPendente += valorPendente
            }
            
            if (parcela.status === "atrasado") {
              cliente.parcelasAtrasadas += 1
            }
          }
        }
      }
      
      let clientes = Array.from(clientesMap.values())
      
      // Filtrar por termo de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        clientes = clientes.filter((c) => c.nome.toLowerCase().includes(term))
      }
      
      return clientes.sort((a, b) => a.nome.localeCompare(b.nome))
    },
  })
}

export function useClienteByName(nome: string) {
  return useQuery({
    queryKey: queryKeys.clientes.byName(nome),
    queryFn: async (): Promise<ClienteDetail> => {
      const vendasResponse = await vendasApi.getAll()
      const vendas = vendasResponse?.data || []
      const vendasCliente = vendas.filter((v) => v.compradorNome === nome)
      
      if (vendasCliente.length === 0) {
        throw new Error("Cliente não encontrado")
      }
      
      const primeiraVenda = vendasCliente[0]
      let valorPendente = 0
      let valorTotal = 0
      let valorPago = 0
      let parcelasAtrasadas = 0
      
      for (const venda of vendasCliente) {
        valorTotal += venda.valorTotal
        
        if (venda.parcelas) {
          for (const parcela of venda.parcelas) {
            const totalPago = parcela.pagamentos?.reduce((sum, p) => sum + p.valor, 0) || 0
            const valorPendenteParcela = parcela.valor - totalPago
            
            valorPago += totalPago
            
            if (valorPendenteParcela > 0) {
              valorPendente += valorPendenteParcela
            }
            
            if (parcela.status === "atrasado") {
              parcelasAtrasadas += 1
            }
          }
        }
      }
      
      return {
        nome: primeiraVenda.compradorNome,
        cpf: primeiraVenda.compradorCpf,
        telefone: primeiraVenda.compradorTelefone,
        email: primeiraVenda.compradorEmail,
        valorPendente,
        valorTotal,
        valorPago,
        parcelasAtrasadas,
        totalVendas: vendasCliente.length,
        vendas: vendasCliente,
      }
    },
    enabled: !!nome,
  })
}
