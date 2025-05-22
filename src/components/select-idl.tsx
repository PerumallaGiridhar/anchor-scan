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
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

export function SelectIdl() {
    const navigate = useNavigate()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">Get Started</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Anchor IDL & Network</DialogTitle>
                    <DialogDescription>
                        Your file is saved in localstore!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row gap-4 py-4">
                    <Label htmlFor="name" className="text-right">
                        IDL
                    </Label>
                    <Input id="name" type="file" className="col-span-2" placeholder="No file chosen" />
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <img src="/solanaLogoMark.svg" alt="Solana Logo" className="w-7 h-7" />
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Network" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Network</SelectLabel>
                                <SelectItem value="apple">Mainnet Beta</SelectItem>
                                <SelectItem value="banana">Devnet</SelectItem>
                                <SelectItem value="blueberry">Testnet</SelectItem>
                                <SelectItem value="grapes">Custom</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => { navigate("/scan") }}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
