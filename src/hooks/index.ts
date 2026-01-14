export * from "./useMapData"
export * from "./useDividas"
export * from "./useResumo"
export {
  useLotes,
  useLote,
  useLotesBySetor,
  useResumoLotesStatus,
  useLotesVendidos,
  useLotesDisponiveis,
  useCreateLote,
  useUpdateLote,
  useDeleteLote,
  useRegistrarVendaLote,
} from "@/shared/hooks/useLotes"
export { useSetores, useSetorBySlug, useSetorById, useSetorLotes } from "@/shared/hooks/useSetores"
