import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "./components/ui/select"
import { Button } from "./components/ui/button"
import { Edit, FilePenLine, FileSearch, Share, Signature, Trash2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { Addinstruction } from "./components/add-instruction"
import { useInstructionStore } from "./stores/useInstructionStore"
import { ManageKeypairs } from "./components/manage-keypairs"
import { useTransactionStore } from "./stores/useTransactionStore"
import { sendAndConfirm } from "./lib/buildTransaction"
import { SignTransaction } from "./components/sign-transaction"
import { useSignerStore } from "./stores/useSignerStore"
import { Badge } from "./components/ui/badge"
import { useNetworkStore } from "./stores/useNetworkStore"
import { useMemo, useState } from "react"
import { Connection, type Signer } from "@solana/web3.js"
import { useKeypairStore } from "./stores/useKeypairStore"
import { TransactionSuccessDialog } from "./components/transaction-success-dialog"
import { AlertDestructive } from "./components/alert-destructive"
import { Accounts } from "./components/accounts/accounts"

export const Playground = () => {
    // const defaultValue = {
    //     "pubkey": "8yzo4aPR9XavdcXTfVjYQzB7QoZcUbKwE6NQEBE4GLoV",
    //     "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    //     "lamports": 2039280,
    //     "data": {
    //         "mint": "So11111111111111111111111111111111111111112",
    //         "owner": "4Nd1mRhB1n34JPU7kR5Y7tnMeWsxAYvEPN4HQqG7YuvG",
    //         "amount": "15000000",
    //         "delegate": null,
    //         "delegatedAmount": "0",
    //         "isInitialized": true,
    //         "isFrozen": false,
    //         "closeAuthority": null
    //     },
    //     "executable": false,
    //     "rentEpoch": 420
    // }
    const base64Tx = useTransactionStore((s) => s.base64Tx)
    const getURL = useNetworkStore((s) => s.getRpcEndpoint)

    const connection = useMemo(
        () => {
            const url = getURL()
            return new Connection(url, "confirmed")
        },
        []
    )
    const keypairs = useKeypairStore((s) => s.keypairs)
    const hasSigned = useSignerStore((s) => s.hasSigned)

    const { address } = useParams<{ address: string }>()
    const defaultValue = JSON.parse(localStorage.getItem(`idl-${address}`)!)

    const instructions = useInstructionStore((s) => s.instructions)

    instructions.forEach((ix) => {
        console.log(ix.name, ix.accounts, ix.args)
    })

    const signers = useSignerStore((s) => s.signers)

    const [openTransactionDialog, setOpenTransactionDialog] = useState(false)
    const [error, setError] = useState<{title: string, message:string}>({title: "", message: ""})
    const [transactionSig, setTransactionSig] = useState("")


    return (
        <div className="flex flex-col w-full h-full items-start justify-start gap-10 p-6">
            <div className="flex w-full justify-between items-center">
                {/* <div className="flex flex-row border-1 rounded-md">
                    <div className="flex items-center bg-primary text-primary-foreground p-2 rounded-l-md">
                        <Label htmlFor="programId" className="whitespace-nowrap">
                            Program Id
                        </Label>
                    </div>
                    <code className="relative rounded-r-md bg-muted p-2 font-mono text-sm font-normal">
                        8yzo4aPR9XavdcXTfVjYQzB7QoZcUbKwE6NQEBE4GLoV
                    </code>
                </div> */}
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-4xl text-grey-900 leading-[1.2]">Playground</p>
                    <p className="text-muted-foreground font-mono">play-{address}</p>
                </div>
                <div className="flex gap-2">
                    <ManageKeypairs />
                    <Button>
                        Share
                        <Share />
                    </Button>
                    <Button>
                        Edit
                        <FilePenLine />
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="Account" className="w-full">
                <TabsList className="grid w-1/2 grid-cols-3">
                    <TabsTrigger value="account">Fetch Accounts</TabsTrigger>
                    <TabsTrigger value="transactions">Build Transactions</TabsTrigger>
                    <TabsTrigger value="history">Confirmed Signatures</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Accounts/>
                </TabsContent>
                <TabsContent value="transactions">
                    <div className="flex flex-col h-full py-4 gap-4">
                        <Label htmlFor="transaction">Build Transaction</Label>
                        <div className="flex flex-col w-full gap-1.5 border-1 rounded-md h-4/5 overflow-y-scroll">
                            <div id="transaction" className=" w-full p-6 font-mono">
                                <div className="flex flex-row justify-between">
                                    <p>transaction {"("}</p>
                                    <Button variant={"secondary"}><FileSearch />Browse Saved Transactions</Button>
                                </div>
                                <div className="flex flex-col p-6 gap-2">
                                    {instructions.map((ix, i) => {
                                        return (
                                            <div key={i} className="flex flex-row gap-1 items-end">
                                                <Button variant="secondary"
                                                    onClick={() => {
                                                        useInstructionStore.getState().setEditingIndex(i)
                                                    }}
                                                >{ix.name} <Edit /></Button>
                                                <Button size="icon" variant="secondary"
                                                    onClick={() => useInstructionStore.getState().removeInstruction(i)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                                <p className="font-mono">{","}</p>
                                            </div>

                                        )
                                    })}
                                    <div className="flex flex-row gap-1 items-end">
                                        <Button variant="secondary">latestBlockHash</Button>
                                        <p className="font-mono">{","}</p>
                                    </div>
                                    <div className="flex flex-row gap-1 items-end">
                                        <Button variant="secondary">lastBlockHeight</Button>
                                        <p className="font-mono">{","}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-fit">
                                        {signers?.map((pk) => (
                                            <div className="flex gap-2 items-end">
                                                <Button key={pk.pubkey} variant={"secondary"}>
                                                    <Signature />
                                                    {pk.pubkey}
                                                </Button>
                                                {pk.isPayer ? <Badge variant={"secondary"} className="self-center">Payer</Badge> : <></>}
                                                <p className="font-mono">{","}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p>{")"}</p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-2">
                                <Addinstruction />
                                <SignTransaction />
                            </div>
                            <Button
                                onClick={async () => {
                                    if (!base64Tx) {
                                        alert("Transaction not found.")
                                        return
                                    }
                                    const signers = Object.entries(keypairs).filter(([pubkey, _kp]) =>
                                        hasSigned(pubkey)
                                    ).map(([, kp]) => kp) as Signer[]
                                    try {
                                        const signatrue = await sendAndConfirm({ connection, base64Tx, signers })
                                        if (signatrue) {
                                            console.log("hurrey!!!!!!! ", signatrue)
                                            useInstructionStore.getState().clearInstructions()
                                            useTransactionStore.getState().clearTransaction()
                                            useSignerStore.getState().clearSigners?.()
                                            setTransactionSig(signatrue)
                                            setOpenTransactionDialog(true)
                                            setError({title: "", message: ""})
                                        }

                                    } catch (err: any) {
                                        setError({title: "Transaction simulation failed", message: err?.message ?? String(err)})
                                    }

                                }}
                            >Send & Confirm Transaction</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            <TransactionSuccessDialog open={openTransactionDialog} setOpen={setOpenTransactionDialog} signature={transactionSig} />
            {error.title && <AlertDestructive title={error.title} message={error.message}/>}
        </div>
    )
}