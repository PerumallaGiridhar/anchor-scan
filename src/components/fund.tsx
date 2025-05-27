import { CircleDollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "./ui/copy-button"

export function Fund() {
    const wallet = "88pUr1zHW2hhdbSvhkreWfAVp8wMtwq4TAizeBUUiLQ9"
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Fund<CircleDollarSign /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Thank you!</DialogTitle>
                    <DialogDescription>
                        You can transfer to the following solana address. Your funds supports us to contribute more the community.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Address
                        </Label>
                        <Input
                            id="link"
                            defaultValue={wallet}
                            readOnly
                        />
                    </div>
                    <CopyButton text={wallet}/>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
