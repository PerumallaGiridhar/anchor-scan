import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useKeypairStore } from "@/stores/useKeypairStore"
import { Search } from "lucide-react"
import { CopyButton } from "./ui/copy-button"
import { usePdaStore } from "@/stores/usePdaStore"

export function ManageKeypairs({ varient, disabled }: { varient?: "icon" | "button", disabled?: boolean }) {
    const keypairs = useKeypairStore((s) => s.keypairs)
    const entries = Object.entries(keypairs)

    const pdas = usePdaStore((s) => s.pdaAccounts)
    const pdaEntries = Object.entries(pdas)

    return (
        <Popover>
            <PopoverTrigger asChild>
                {varient === "icon" ? (
                    <Button size={"icon"} variant={"secondary"} disabled={disabled ? true : false}>
                        <Search />
                    </Button>

                ) : (
                    <Button variant={"secondary"} disabled={disabled ? true : false}>
                        Keypairs
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="grid gap-8">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Keypairs List</h4>
                        <p className="text-sm text-muted-foreground">
                            Variety of keypairs to play with
                        </p>
                    </div>
                    {entries.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No keypairs generated yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {entries.map(([pubkey]) => (
                                <div className="flex gap-1">
                                    <code
                                        key={pubkey}
                                        className="rounded-md bg-muted p-2 font-mono text-sm font-normal w-sm"
                                    >
                                        {pubkey}
                                    </code>
                                    <CopyButton text={pubkey} varient="secondary" />
                                </div>
                            ))}
                        </div>
                    )}
                    {pdaEntries.length > 0 &&
                        <div className="flex flex-col gap-4">
                            {pdaEntries.map(([pdaName, pda]) => {
                                const seedsDisplay = pda.seeds.reduce((acc, seed) => {
                                    acc += seed.length > 5 ? (seed.toString().slice(0,5) + '..') : seed + ', '
                                    return acc
                                }, "")
                                return (
                                    <div className="flex gap-0">
                                        <div key={pdaName} className="relative p-2">
                                            <code
                                                className="rounded-md bg-muted p-2 font-mono text-sm font-normal w-sm"
                                            >
                                                {pda.pubkey.toBase58()}
                                            </code>
                                            <p className="absolute left-2 -top-3 text-xs text-muted-foreground">{`pda-${pda.account}-[${seedsDisplay}]`}</p>
                                        </div>
                                        <CopyButton text={pda.pubkey.toBase58()} varient="secondary" />
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}
