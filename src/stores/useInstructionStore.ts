import { create } from "zustand"

type Instruction = {
  name: string
  accounts: Record<string, string> // account name → pubkey
  args: Record<string, any>       // arg name → value
  seeds?: Record<string, any>
}

type InstructionStore = {
  instructions: Instruction[]
  addInstruction: (inst: Instruction) => void
  updateInstruction: (index: number, updated: Instruction) => void
  removeInstruction: (index: number) => void
  editingIndex: number | null
  setEditingIndex: (i: number | null) => void
  clearInstructions: () => void
}

export const useInstructionStore = create<InstructionStore>((set) => ({
  instructions: [],
  addInstruction: (inst) =>
    set((s) => ({ instructions: [...s.instructions, inst] })),
  updateInstruction: (index, updated) =>
    set((s) => {
      const next = [...s.instructions]
      next[index] = updated
      return { instructions: next }
    }),
  removeInstruction: (index) =>
    set((s) => {
      const next = [...s.instructions]
      next.splice(index, 1)
      return { instructions: next }
    }),
  editingIndex: null,
  setEditingIndex: (i) => set({ editingIndex: i }),
  clearInstructions: () => set({instructions: []})
}))





