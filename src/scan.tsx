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
import { FilePenLine, Share } from "lucide-react"


export const Scan = () => {
    const defaultValue = {
        "pubkey": "8yzo4aPR9XavdcXTfVjYQzB7QoZcUbKwE6NQEBE4GLoV",
        "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "lamports": 2039280,
        "data": {
            "mint": "So11111111111111111111111111111111111111112",
            "owner": "4Nd1mRhB1n34JPU7kR5Y7tnMeWsxAYvEPN4HQqG7YuvG",
            "amount": "15000000",
            "delegate": null,
            "delegatedAmount": "0",
            "isInitialized": true,
            "isFrozen": false,
            "closeAuthority": null
        },
        "executable": false,
        "rentEpoch": 420
    }
    return (
        <div className="flex flex-col w-full h-full items-start justify-start gap-10 p-6">
            <div className="flex w-full justify-between items-center">
                <div className="flex flex-row border-1 rounded-md">
                    <div className="flex items-center bg-primary text-primary-foreground p-2 rounded-l-md">
                        <Label htmlFor="programId" className="whitespace-nowrap">
                            Program Id
                        </Label>
                    </div>
                    {/* <div className="p-2 rounded-md">
                        <p className="text-muted-foreground text-sm">8yzo4aPR9XavdcXTfVjYQzB7QoZcUbKwE6NQEBE4GLoV</p>
                    </div> */}
                    <code className="relative rounded-r-md bg-muted p-2 font-mono text-sm font-normal">
                        8yzo4aPR9XavdcXTfVjYQzB7QoZcUbKwE6NQEBE4GLoV
                    </code>
                </div>
                <div className="flex gap-2">
                    <Button>
                        Share IDL
                        <Share />
                    </Button>
                    <Button>
                        Change IDL
                        <FilePenLine />
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="Account" className="w-full">
                <TabsList className="grid w-1/2 grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <div className="flex flex-col gap-6 w-full h-full py-6">
                        <div className="flex flex-row gap-2">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Accounts defined in idl</SelectLabel>
                                        <SelectItem value="apple">Mainnet Beta</SelectItem>
                                        <SelectItem value="banana">Devnet</SelectItem>
                                        <SelectItem value="blueberry">Testnet</SelectItem>
                                        <SelectItem value="grapes">Custom</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input id="Address" placeholder="enter program account adress" className="w-md rounded-sm" />
                            <Button>Fetch Account</Button>
                        </div>
                        <div className="flex flex-col w-full gap-1.5 h-full">
                            <Label htmlFor="message-2">Your Account</Label>
                            <Textarea placeholder="No account provided" id="message-2" readOnly
                                defaultValue={JSON.stringify(defaultValue, null, 2)}
                                className="h-full !text-lg text-foreground font-medium font-mono leading-relaxed"
                            />
                            <p className="text-sm text-muted-foreground">
                                Your message will be copied to the support team.
                            </p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="transactions">
                    <div className="flex flex-row gap-2 py-6">
                        <Button>Add Instruction</Button>
                        <Button>Send & Confirm Transaction</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}