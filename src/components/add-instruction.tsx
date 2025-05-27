import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import type { Idl } from "@/types"
import { useInstructionStore } from "@/stores/useInstructionStore"
import { FileSearch, RefreshCcw } from "lucide-react"
import { Keypair, PublicKey } from "@solana/web3.js"
import { useKeypairStore } from "@/stores/useKeypairStore"
import { Label } from "./ui/label"
import { BN } from "@coral-xyz/anchor"
import { ManageKeypairs } from "./manage-keypairs"
import { usePdaStore } from "@/stores/usePdaStore"



export function Addinstruction() {
    const { address } = useParams<{ address: string }>()


    const idl: Idl = JSON.parse(localStorage.getItem(`idl-${address}`)!)

    console.log(idl)

    const instructionMap = Object.fromEntries(
        idl.instructions.map((ix) => [
            ix.name,
            {
                accounts: ix.accounts,
                args: ix.args.map((a) => ({ name: a.name, type: a.type })),
            },
        ])
    )

    const [selectedInstruction, setSelectedInstruction] = useState<string>("")
    const accountFields = instructionMap[selectedInstruction]?.accounts.reduce((acc, account) => {
        acc[account.name] = z.string().min(1, "Required")
        return acc
    }, {} as Record<string, z.ZodTypeAny>)

    const argFields = instructionMap[selectedInstruction]?.args.reduce((acc, arg) => {
        // Detect integers like "u64", "i128", etc.
        const isInteger = typeof arg.type === "string" && /^u\d+|^i\d+$/i.test(arg.type)

        acc[arg.name] = isInteger
            ? z
                .any()
                .refine((val) => val && val.toString().match(/^\d+$/), {
                    message: "Must be an integer",
                })
            : z.string().min(1, "Required")

        return acc
    }, {} as Record<string, z.ZodTypeAny>)

    const formSchema = z.object({
        instruction: z.string(),
        accounts: z.object(accountFields),
        args: z.object(argFields),
        seeds: z.record(z.array(z.string())).optional(),
    })


    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            instruction: "",
            accounts: {},
            args: {},
            seeds: {},
        },
    })
    const { editingIndex, setEditingIndex, updateInstruction, addInstruction, instructions } = useInstructionStore()
    useEffect(() => {
        if (editingIndex !== null) {
            const toEdit = instructions[editingIndex]
            setSelectedInstruction(toEdit.name)
            form.reset({
                instruction: toEdit.name,
                accounts: toEdit.accounts,
                args: toEdit.args,
                seeds: toEdit.seeds,
            })
            setOpen(true)
        }
    }, [editingIndex])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("subimtting form")
        const isIntegerType = (type: string) => /^u\d+|^i\d+$/i.test(type)
        const transformedArgs = Object.fromEntries(
            Object.entries(values.args).map(([key, val]) => {
                const argType = instructionMap[values.instruction].args.find(arg => arg.name === key)?.type
                const parsed = isIntegerType(argType) ? new BN(val) : val
                return [key, parsed]
            })
        )
        const updated = {
            name: values.instruction,
            accounts: values.accounts,
            args: transformedArgs,
            seeds: values.seeds,
        }

        if (editingIndex !== null) {
            updateInstruction(editingIndex, updated)
            setEditingIndex(null)
        } else {
            addInstruction(updated)
        }

        setSelectedInstruction("")
        setOpen(false)
        form.reset()
    }

    const currentInstruction = instructionMap[selectedInstruction]


    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) setEditingIndex(null)  // ✅ Clear editing state when closed
        }}>
            <DialogTrigger asChild>
                <Button variant="secondary">Add Instruction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] sm:max-h-5/6 overflow-auto">
                <DialogHeader>
                    <DialogTitle>Add Instruction</DialogTitle>
                    <DialogDescription>
                        Select your instruction, and fill in the required accounts and arguments.
                    </DialogDescription>
                    <Button variant={"secondary"} className="w-fit"><FileSearch />Browse Saved Instructions</Button>
                </DialogHeader>
                <div className="grid p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (error) => {
                            console.log(error)
                            console.log(form.getValues("seeds"))
                        })} className="space-y-7">
                            <FormField
                                control={form.control}
                                name="instruction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instruction</FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                setSelectedInstruction(val)
                                                field.onChange(val)
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Instruction" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Program Instructions</SelectLabel>
                                                    {idl.instructions.map((ix) => (
                                                        <SelectItem key={ix.name} value={ix.name}>
                                                            {ix.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {currentInstruction?.accounts?.map((account) => {
                                const isPda = !!account.pda
                                if (account.address && !form.getValues(`accounts.${account.name}`)) {
                                    form.setValue(`accounts.${account.name}`, account.address, {
                                        shouldValidate: true,
                                        shouldDirty: false,
                                    })
                                }
                                return (
                                    <div>
                                        {isPda ? (
                                            <div>
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor={`${account.name}`}>
                                                        {account.name}
                                                    </Label>
                                                    <div id={`${account.name}`} className="flex flex-col p-4 border-1 gap-4 rounded-md">
                                                        <FormField
                                                            key={account.name}
                                                            control={form.control}
                                                            name={`accounts.${account.name}`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-muted-foreground text-xs">PDA</FormLabel>
                                                                    <FormControl>
                                                                        <Input readOnly {...field} className="placeholder:text-xs"
                                                                            value={form.watch(`accounts.${account.name}`)}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>

                                                            )}
                                                        />
                                                        <Label className="text-muted-foreground text-xs">Seeds</Label>
                                                        {account.pda?.seeds?.map((seed, idx) => {
                                                            if (seed.value) {
                                                                const codes = seed.value
                                                                form.setValue(`seeds.${account.name}.${idx}`, String.fromCharCode(...codes))
                                                                return (
                                                                    <FormField
                                                                        key={`seeds.${account.name}.${idx}`}
                                                                        control={form.control}
                                                                        name={`seeds.${account.name}.${idx}`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        readOnly
                                                                                        // value={String.fromCharCode(...codes)}
                                                                                        className="placeholder:text-xs"
                                                                                        {...field}
                                                                                    ></Input>
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )} />

                                                                )
                                                            } else {
                                                                return (
                                                                    <FormField
                                                                        key={`seeds.${account.name}.${idx}`}
                                                                        control={form.control}
                                                                        name={`seeds.${account.name}.${idx}`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        placeholder={seed.path}
                                                                                        className="placeholder:text-xs"
                                                                                        defaultValue={form.getValues(`seeds.${account.name}.${idx}`)}
                                                                                        {...field}
                                                                                    >
                                                                                    </Input>
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )} />
                                                                )
                                                            }
                                                        })}
                                                        <Button
                                                            type="button"
                                                            className="w-fit"
                                                            variant={"secondary"}
                                                            onClick={() => {
                                                                // here you should derive PDA using the seed inputs
                                                                const programId = new PublicKey(idl.address)
                                                                const rawSeeds = form.getValues(`seeds.${account.name}`)
                                                                const seedList = Object.values(rawSeeds)
                                                                const seedBuffers = Object.values(rawSeeds).map((val) => {
                                                                    try {
                                                                        return new PublicKey(val).toBuffer()
                                                                    } catch {
                                                                        return Buffer.from(val) // fallback to raw bytes
                                                                    }
                                                                })
                                                                const [pda] = PublicKey.findProgramAddressSync(
                                                                    seedBuffers,
                                                                    programId
                                                                )
                                                                form.setValue(`accounts.${account.name}`, pda.toBase58())
                                                                usePdaStore.getState().addPda(`pda-${account.name}-[${rawSeeds}]`, { pubkey: pda, seeds: seedList, account: account.name })
                                                            }}
                                                        >
                                                            Derive PDA
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <FormField
                                                key={account.name}
                                                control={form.control}
                                                name={`accounts.${account.name}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{account.name}</FormLabel>
                                                        <FormControl>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder={`Enter pubkey for ${account.name}`}
                                                                    className="placeholder:text-xs"
                                                                    {...field}

                                                                />
                                                                <Button size="icon" variant="secondary" type="button"
                                                                    onClick={() => {
                                                                        const kp = Keypair.generate()
                                                                        const pubkeyStr = kp.publicKey.toBase58()
                                                                        form.setValue(`accounts.${account.name}`, pubkeyStr)
                                                                        useKeypairStore.getState().addKeypair(pubkeyStr, kp)
                                                                    }}
                                                                    disabled={account.address ? true : false}
                                                                ><RefreshCcw /></Button>
                                                                <ManageKeypairs varient="icon" disabled={account.address ? true : false}/>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                        )}
                                    </div>
                                )
                            }
                            )}
                            {currentInstruction?.args?.map((arg) => {
                                return (
                                    <FormField
                                        key={arg.name}
                                        control={form.control}
                                        name={`args.${arg.name}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{arg.name}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`Enter ${arg.type} for ${arg.name}`}
                                                        {...field}
                                                        className="placeholder:text-xs" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )
                            })}
                            <DialogFooter>
                                <Button type="submit">Add</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
