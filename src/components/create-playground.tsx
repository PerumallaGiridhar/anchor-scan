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
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNetworkStore, allowedNetworks } from "@/stores/useNetworkStore"
import { Label } from "./ui/label"


export function CreatePlayground() {

    const setNetwork = useNetworkStore((s) => s.setNetwork)
    const options = useNetworkStore((s) => s.options)
    const customRpcUrl = useNetworkStore((s) => s.customRpcUrl)
    const setCustomRpcUrl = useNetworkStore((s) => s.setCustomRpcUrl)


    const NetworkEnum = z.enum(allowedNetworks)
    const formSchema = z.object({
        idl: z.any(),
        network: NetworkEnum,
    })

    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idl: undefined,
            network: "mainnet-beta",
        },
    })



    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const file = values.idl?.[0]
        if (!file) return alert("Please upload an IDL file.")
        try {
            const content = await file.text()
            const parsed = JSON.parse(content)

            if (!parsed?.address) {
                alert("Invalid IDL: Missing program ID in metadata.")
                return
            }

            localStorage.setItem(`idl-${parsed?.address}`, content)
            localStorage.setItem("network", values.network)
            setNetwork(values.network)

            navigate(`/play/${parsed.address}`)
        } catch (err) {
            alert("Failed to parse IDL JSON.")
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">Get Started</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create your IDL Playground</DialogTitle>
                    <DialogDescription>
                        Select your IDL file and network to start playing.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="idl"
                            render={() => (
                                <FormItem className="w-full">
                                    <div className="flex flex-row w-full gap-4 py-4 items-start">
                                        <FormLabel className="mt-3">IDL</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col w-full gap-1">
                                                <Input id="idl"
                                                    type="file"
                                                    accept=".json"
                                                    // {...field}
                                                    onChange={(e) => {
                                                        form.setValue("idl", e.target.files)
                                                    }}
                                                    className="w-full"
                                                />
                                                <FormDescription>
                                                    Select your program's idl.json file
                                                </FormDescription>
                                            </div>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="network"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <div className="flex flex-row gap-4 w-full items-center">
                                        <FormLabel>
                                            <img src="/solanaLogoMark.svg" alt="Solana Logo" className="w-7 h-7" />
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <FormControl>
                                                    <SelectValue placeholder="Select Network" />
                                                </FormControl>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Network</SelectLabel>
                                                    {options.map(({ label, value }) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("network") === "custom" && (
                            <div className="flex flex-row w-full gap-4 py-4 items-center">
                                <Label>URL</Label>
                                <Input
                                    placeholder="Enter Custom RPC URL"
                                    value={customRpcUrl}
                                    onChange={(e) => setCustomRpcUrl(e.target.value)}
                                />
                            </div>

                        )}
                        <DialogFooter>
                            <Button type="submit">Continue</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
