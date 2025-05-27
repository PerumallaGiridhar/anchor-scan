import { create } from "zustand"
import { Keypair } from "@solana/web3.js"

type KeypairStore = {
  keypairs: Record<string, Keypair> // pubkey → full Keypair
  addKeypair: (pubkey: string, keypair: Keypair) => void
  getKeypair: (pubkey: string) => Keypair | undefined
  clear: () => void
}

export const useKeypairStore = create<KeypairStore>((set, get) => ({
  keypairs: {},
  addKeypair: (pubkey, keypair) =>
    set((s) => ({ keypairs: { ...s.keypairs, [pubkey]: keypair } })),
  getKeypair: (pubkey) => get().keypairs[pubkey],
  clear: () => set({ keypairs: {} }),
}))
