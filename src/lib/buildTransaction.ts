import {
    Transaction,
    Keypair,
    Connection,
    PublicKey,
    type Signer,
    sendAndConfirmTransaction,
} from "@solana/web3.js"
import { useInstructionStore } from "@/stores/useInstructionStore"
import { Program } from "@coral-xyz/anchor"
import { useTransactionStore } from "@/stores/useTransactionStore"
import { Buffer } from "buffer"
import { useSignerStore } from "@/stores/useSignerStore"

export async function buildAndSerializeTransaction({
    program,
    connection,
    payer,
    signers = [],
}: {
    program: Program
    connection: Connection
    payer?: PublicKey
    signers?: Keypair[]
}): Promise<string> {

    const setSigners = useSignerStore.getState().setSigners
    const addSigner = useSignerStore.getState().addSigner
    const { base64Tx, setTransaction } = useTransactionStore.getState()
    let tx: Transaction

    // ✅ Case 1: Transaction already exists, re-sign if needed
    if (base64Tx) {
        console.log("resigning")
        const buffer = Buffer.from(base64Tx, "base64")
        tx = Transaction.from(buffer)

        for (const signer of signers) {
            const alreadySigned = tx.signatures.some(
                (sig) =>
                    sig.publicKey.toBase58() === signer.publicKey.toBase58() &&
                    sig.signature !== null
            )

            if (!alreadySigned) {
                tx.partialSign(signer)
                addSigner({
                    pubkey: signer.publicKey.toBase58(),
                    isPayer: payer?.toBase58() === signer.publicKey.toBase58()
                })
            }
        }

        const reSerialized = tx.serialize({ requireAllSignatures: false }).toString("base64")
        setTransaction(reSerialized)
        return reSerialized
    }
    console.log("inside signing first time")
    // ✅ Case 2: No transaction yet → build from scratch
    const instructions = useInstructionStore.getState().instructions
    tx = new Transaction()

    for (const ix of instructions) {
        const method = program.methods[ix.name](...Object.values(ix.args))
        console.log(method)
        console.log(ix.accounts)
        const ixBuilder = await method.accounts(ix.accounts).instruction()
        tx.add(ixBuilder)
    }

    if (payer) {
        tx.feePayer = payer
    }

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    if (signers.length > 0) {
        tx.partialSign(...signers)
        const signerEntries = signers.map((kp) => ({
            pubkey: kp.publicKey.toBase58(),
            isPayer: payer?.toBase58() === kp.publicKey.toBase58(),
        }))
        setSigners(signerEntries)
    }

    const serialized = tx.serialize({ requireAllSignatures: false }).toString("base64")
    setTransaction(serialized)
    return serialized
}

export function getSigners(base64Tx: string): string[] {
    try {
        const buffer = Buffer.from(base64Tx, "base64")
        const tx = Transaction.from(buffer)

        return tx.signatures
            .filter((sig) => sig.signature !== null)
            .map((sig) => sig.publicKey.toBase58())
    } catch (e) {
        console.error("Invalid base64 transaction:", e)
        return []
    }
}


export async function sendAndConfirm({
    connection,
    base64Tx,
    signers,
}: {
    connection: Connection
    base64Tx: string
    signers: Signer[]
}) {
    try {
        const txBuffer = Buffer.from(base64Tx, "base64")
        const tx = Transaction.from(txBuffer)

        // const blockhash = await connection.getLatestBlockhash()
        // const blockHeight = await connection.getBlockHeight()
        // const txid = await sendAndConfirmRawTransaction(connection, txBuffer, {signature: tx.signature, blockhash: blockhash, lastValidBlockHeight: blockHeight }, {
        //     skipPreflight: false,
        //     commitment: "confirmed",
        // })

        const txid = await sendAndConfirmTransaction(connection, tx, signers, {maxRetries: 5})

        console.log("✅ Transaction sent:", txid)
        return txid
    } catch (err) {
        console.error("❌ Failed to send transaction:", err)
        throw err
    }
}