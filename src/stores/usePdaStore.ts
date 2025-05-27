import { create } from "zustand"
import { PublicKey } from "@solana/web3.js"

type PDAEntry = {
  pubkey: PublicKey
  account: string
  seeds: (Buffer | Uint8Array | string)[]
}

type PdaStore = {
  pdaAccounts: Record<string, PDAEntry> // name → PDA info
  addPda: (name: string, entry: PDAEntry) => void
  getPda: (name: string) => PDAEntry | undefined
  clear: () => void
}

export const usePdaStore = create<PdaStore>((set, get) => ({
  pdaAccounts: {},
  addPda: (name, entry) =>
    set((s) => ({ pdaAccounts: { ...s.pdaAccounts, [name]: entry } })),
  getPda: (name) => get().pdaAccounts[name],
  clear: () => set({ pdaAccounts: {} }),
}))
