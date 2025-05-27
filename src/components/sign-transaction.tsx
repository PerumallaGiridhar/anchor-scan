import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useKeypairStore } from "@/stores/useKeypairStore"
import { Checkbox } from "./ui/checkbox"
import { Connection, PublicKey } from "@solana/web3.js"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Program } from "@coral-xyz/anchor"
import { buildAndSerializeTransaction } from "@/lib/buildTransaction"
import { useSignerStore } from "@/stores/useSignerStore"
import { CircleCheckBig } from "lucide-react"
import { useNetworkStore } from "@/stores/useNetworkStore"

export function SignTransaction() {
    const [payerPubkey, setPayerPubkey] = useState<PublicKey | undefined>(undefined)
    const keypairs = useKeypairStore((s) => s.keypairs)
    const hasSigned = useSignerStore((s) => s.hasSigned)
    const entries = Object.entries(keypairs)
    const { address } = useParams<{ address: string }>()
    const getURL = useNetworkStore((s) => s.getRpcEndpoint)

    const connection = useMemo(
        () => {
            const url = getURL()
            return new Connection(url, "confirmed")
        },
        []
    )
    const idl = JSON.parse(localStorage.getItem(`idl-${address}`)!)
    const program = new Program(idl, { connection })


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary">Creaet & Sign Transaction</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="grid gap-4">
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
                            {entries.map(([pubkey, keypair]) => (
                                <div key={pubkey} className="flex gap-1">
                                    <code
                                        className="rounded-md bg-muted p-2 font-mono text-sm font-normal"
                                    >
                                        {pubkey}
                                    </code>
                                    <Button
                                        variant={"secondary"}
                                        onClick={async () => {
                                            try {
                                                console.log("signing txn")
                                                const base64 = await buildAndSerializeTransaction({
                                                    program,
                                                    connection,
                                                    payer: payerPubkey,
                                                    signers: [keypair],
                                                })
                                                console.log("✅ Signed TX:", base64)
                                            } catch (err) {
                                                console.error("Signing failed:", err)
                                            }

                                        }}
                                        disabled={hasSigned(keypair.publicKey.toBase58())}
                                    >
                                        { hasSigned(keypair.publicKey.toBase58()) ? (
                                            <div className="flex flex-row gap-1 items-center">
                                                <CircleCheckBig className="text-green-800"/>
                                                <p>Signed</p>
                                            </div>
                                        ) : "Sign"}
                                    </Button>
                                    <div className="flex flex-row items-center space-x-2">
                                        <Checkbox
                                            id={`payer-${pubkey}`}
                                            value={`payer-${pubkey}`}
                                            checked={payerPubkey?.toBase58() === keypair.publicKey.toBase58() ? true : false}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setPayerPubkey(keypair.publicKey)
                                                } else {
                                                    setPayerPubkey(undefined)
                                                }
                                            }
                                            }
                                        />
                                        <label
                                            htmlFor={`payer-${pubkey}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Payer
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
