import { createStore, useStore, type StoreApi } from "zustand"
import type {
    SortingState,
    ColumnFiltersState,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table"
import { getOptimalPageSize } from "@/utils"

interface TableFilterStoreState {
    searchTerm: string
    sorting: SortingState
    columnFilters: ColumnFiltersState
    pagination: PaginationState
}

interface TableFilterStoreActions {
    setSearchTerm: (value: string) => void
    setSorting: OnChangeFn<SortingState>
    setColumnFilters: OnChangeFn<ColumnFiltersState>
    setPagination: OnChangeFn<PaginationState>
}

type TableFilterStore = TableFilterStoreState & TableFilterStoreActions

const tableFilterStoreMap = new Map<string, StoreApi<TableFilterStore>>()

function createTableFilterStore(): StoreApi<TableFilterStore> {
    return createStore<TableFilterStore>()((set) => ({
        searchTerm: "",
        sorting: [],
        columnFilters: [],
        pagination: { pageIndex: 0, pageSize: getOptimalPageSize() },

        setSearchTerm: (value) => set(() => ({ searchTerm: value })),
        setSorting: (updater) =>
            set((state) => ({
                sorting:
                    typeof updater === "function" ? updater(state.sorting) : updater,
            })),
        setColumnFilters: (updater) =>
            set((state) => ({
                columnFilters:
                    typeof updater === "function"
                        ? updater(state.columnFilters)
                        : updater,
            })),
        setPagination: (updater) =>
            set((state) => ({
                pagination:
                    typeof updater === "function" ? updater(state.pagination) : updater,
            })),
    }))
}

export function getTableFilterStore(tableName: string): StoreApi<TableFilterStore> {
    if (!tableFilterStoreMap.has(tableName)) {
        tableFilterStoreMap.set(tableName, createTableFilterStore())
    }
    return tableFilterStoreMap.get(tableName)!
}


export function useTableFilterStore(tableName: string): TableFilterStore {
  const store = getTableFilterStore(tableName)
  return useStore(store, (s) => s)
}