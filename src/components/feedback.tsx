import { Copy, MessageSquare } from "lucide-react"

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

export function Feedback() {
    const email = "ravigiridhar786@gmail.com"

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Give Feedback <MessageSquare /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Thank you!</DialogTitle>
                    <DialogDescription>
                        You can send your Feedback to the following email address. We will get back to you soon!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="email" className="sr-only">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            defaultValue={email}
                            readOnly
                        />
                    </div>
                    <CopyButton text={email}/>
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
