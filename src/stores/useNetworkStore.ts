import { create } from "zustand"

export const allowedNetworks = ["mainnet-beta", "devnet", "localnet", "custom"] as const
export type Network = typeof allowedNetworks[number]

interface NetworkOption {
  label: string
  value: Network
}

interface NetworkStore {
  network: Network
  customRpcUrl: string
  options: NetworkOption[]
  setNetwork: (network: Network) => void
  setCustomRpcUrl: (url: string) => void
  getRpcEndpoint: () => string
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  network: "localnet",
  customRpcUrl: "http://127.0.0.1:8899",
  options: [
    { label: "Mainnet Beta", value: "mainnet-beta" },
    { label: "Devnet", value: "devnet" },
    { label: "Localnet", value: "localnet" },
    { label: "Custom RPC", value: "custom" },
  ],
  setNetwork: (network) => set({ network }),
  setCustomRpcUrl: (url) => set({ network: "custom", customRpcUrl: url }),
  getRpcEndpoint: () => {
    const { network, customRpcUrl } = get()
    switch (network) {
      case "mainnet-beta":
        return "https://api.mainnet-beta.solana.com"
      case "devnet":
        return "https://api.devnet.solana.com"
      case "localnet":
        return "http://127.0.0.1:8899"
      case "custom":
        return customRpcUrl || ""
      default:
        return ""
    }
  },
}))
