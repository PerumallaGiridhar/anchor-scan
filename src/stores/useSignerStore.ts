import { create } from "zustand"

type Signer = {
  pubkey: string
  isPayer: boolean
}

type SignerStore = {
  signers: Signer[]
  setSigners: (signers: Signer[]) => void
  addSigner: (signer: Signer) => void
  markAsPayer: (pubkey: string) => void
  clearSigners: () => void
  hasSigned: (pubkey: string) => boolean
}

export const useSignerStore = create<SignerStore>((set, get) => ({
  signers: [],
  setSigners: (signers) => set({ signers }),
  addSigner: (signer) =>
    set((state) => {
      const exists = state.signers.some((s) => s.pubkey === signer.pubkey)
      return exists
        ? state
        : { signers: [...state.signers, signer] }
    }),
  markAsPayer: (pubkey) =>
    set((state) => ({
      signers: state.signers.map((s) =>
        s.pubkey === pubkey ? { ...s, isPayer: true } : { ...s, isPayer: false }
      ),
    })),
  clearSigners: () => set({ signers: [] }),
  hasSigned: (pubkey) => get().signers.some((s) => s.pubkey === pubkey),
}))
