"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Account = {
    data: any
    executable: boolean
    lamports: number
    owner: string
    rentEpoch: number | undefined
    space: number

}

export type ProgramAccounts = {
    account: Account
    pubkey: string
    name: string
}



export const columns: ColumnDef<ProgramAccounts>[] = [
    {
        accessorKey: "pubkey",
        header: "Address",
        cell: ({ row }) => {
            return (
                <div>
                    <p className="text-lg">{row.original.pubkey}</p>
                    <p className="text-xs text-muted-foreground">Owner: {row.original.account.owner}</p>
                    <p className="text-xs text-muted-foreground">Lamports: {row.original.account.lamports}</p>
                    <p className="text-xs text-muted-foreground">Space: {row.original.account.space}</p>
                    <p className="text-xs text-muted-foreground">Name: {row.original.name}</p>
                </div>
            )
        },
    }
]
