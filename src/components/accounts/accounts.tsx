import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Button } from "../ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { columns, ProgramAccounts } from "./columns"
import { ColumnFiltersState, getCoreRowModel, useReactTable} from "@tanstack/react-table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import React, { useMemo, useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { useNetworkStore } from "@/stores/useNetworkStore"
import { useParams } from "react-router-dom"

import { BorshCoder, Idl } from "@coral-xyz/anchor"
import { Textarea } from "../ui/textarea"
import { recursivelyConvertNumbersOnly } from "@/utils"
import { CopyButton } from "../ui/copy-button"
import { Search } from "lucide-react"
import bs58 from "bs58"


const fetchProgamAccountsData = async (
    connection: Connection, idl: Idl, selectedAccountType: string, columnFilters: ColumnFiltersState
): Promise<{ rows: ProgramAccounts[] }> => {
    const idlAccount = idl.accounts?.filter((acc) => acc.name === selectedAccountType)
    let discriminator: number[] = []
    if (idlAccount) {
        discriminator = idlAccount[0].discriminator
    }
    let result: ProgramAccounts[] = []

    let filter = columnFilters.find((fil) => fil.id === "pubkey")
    let searchAddress: string = filter?.value as string

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&", searchAddress)

    if (searchAddress) { 
        const pubkey = new PublicKey(searchAddress)
        const accountInfo = await connection.getAccountInfo(pubkey)
        if (accountInfo) {
            const rawAccounts = [{ pubkey: pubkey, account: accountInfo }]
            let decodedAccounts: ProgramAccounts[] = []
            try {
                const coder = new BorshCoder(idl)
                decodedAccounts = rawAccounts.map(({ pubkey, account }) => {
                    const decodedData = coder.accounts.decode(selectedAccountType, account.data)
                    return {
                        pubkey: pubkey.toBase58(),
                        account: {
                            data: decodedData,
                            executable: account.executable,
                            lamports: account.lamports,
                            owner: account.owner.toBase58(),
                            rentEpoch: account.rentEpoch,
                            space: account.data.length,
                        },
                        name: selectedAccountType
                    }
                })
                console.log(decodedAccounts)

            } catch (err) {
                console.log("error: ", err)
            }
            result = decodedAccounts
        }
    } else {
        const rawAccounts = await connection.getProgramAccounts(new PublicKey(idl.address), {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58.encode(discriminator),
                    },
                },
            ],
        })
        let decodedAccounts: ProgramAccounts[] = []

        console.log(rawAccounts)
        try {
            const coder = new BorshCoder(idl)
            decodedAccounts = rawAccounts.map(({ pubkey, account }) => {
                const decodedData = coder.accounts.decode(selectedAccountType, account.data)
                return {
                    pubkey: pubkey.toBase58(),
                    account: {
                        data: decodedData,
                        executable: account.executable,
                        lamports: account.lamports,
                        owner: account.owner.toBase58(),
                        rentEpoch: account.rentEpoch,
                        space: account.data.length,
                    },
                    name: selectedAccountType
                }
            })
            console.log(decodedAccounts)

        } catch (err) {
            console.log("error: ", err)
        }
        result = decodedAccounts
    }



    return {
        rows: result,
    }

}


export const Accounts = () => {
    const getURL = useNetworkStore((s) => s.getRpcEndpoint)
    const { address } = useParams<{ address: string }>()
    const idl: Idl = JSON.parse(localStorage.getItem(`idl-${address}`)!)
    const connection = useMemo(
        () => {
            const url = getURL()
            return new Connection(url, "confirmed")
        },
        []
    )
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const dataQuery = useQuery({
        queryKey: ['accounts', columnFilters],
        queryFn: () => fetchProgamAccountsData(connection, idl, selectedAccountType, columnFilters),
        placeholderData: keepPreviousData,
    })
    const defaultData = React.useMemo(() => [], [])
    
    const table = useReactTable({
        data: dataQuery.data?.rows ?? defaultData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {columnFilters},
        manualFiltering: true,
    })

    const [selectedAccount, setSelectedAccount] = useState<ProgramAccounts | null>(null)
    const [selectedAccountType, setSelectedAccountType] = useState("")
    

    return (
        <div className="flex flex-col gap-6 w-full h-full py-6">
            <div className="flex flex-row gap-2">
                <Select
                    onValueChange={(val) => {
                        setSelectedAccountType(val)
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Program Accounts</SelectLabel>
                            {idl.accounts?.map((ix) => (
                                <SelectItem key={ix.name} value={ix.name}>
                                    {ix.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input id="Address" placeholder="enter program account adress" className="w-md rounded-sm" onChange={(e) => table.getColumn("pubkey")?.setFilterValue(e.target.value)}/>
                <Button variant="secondary" size={"icon"}><Search /></Button>
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] max-h-[calc(100vh-450px)]  max-w-full rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel defaultSize={50}>
                    <DataTable columns={columns} table={table} onRowClick={(row) => {
                        console.log(row)
                        setSelectedAccount(row)
                    }} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <div className="flex flex-col h-full">
                        <div className="flex flex-row justify-between p-4 bg-accent">
                            <div className="flex flex-col gap-0">
                                <p className="text-sm">{selectedAccount?.pubkey}</p>
                                <p className="text-xs text-muted-foreground">Account Data</p>
                            </div>
                            <CopyButton text={JSON.stringify(recursivelyConvertNumbersOnly(selectedAccount?.account.data), null, 2)} varient={"ghost"} />
                        </div>
                        <Textarea placeholder="No account selected" id="message-2" readOnly
                            value={JSON.stringify(recursivelyConvertNumbersOnly(selectedAccount?.account.data), null, 2)}
                            className="h-full !text-md text-foreground font-medium font-mono leading-relaxed overflow-auto border-0"
                        />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}