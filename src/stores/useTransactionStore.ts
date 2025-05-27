import { create } from "zustand"

type TransactionStore = {
  base64Tx: string | null
  setTransaction: (tx: string) => void
  clearTransaction: () => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  base64Tx: null,
  setTransaction: (tx) => set({ base64Tx: tx }),
  clearTransaction: () => set({ base64Tx: null }),
}))
