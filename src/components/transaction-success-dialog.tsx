import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
//   DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Dispatch, SetStateAction } from "react"
import { Textarea } from "./ui/textarea"
import { CopyButton } from "./ui/copy-button"

export function TransactionSuccessDialog({ signature, open, setOpen }: {signature: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
          <DialogDescription>
            Transaction successfully sent & confirmed
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" >
              Signature
            </Label>
            <Textarea
              id="link"
              defaultValue={signature}
              readOnly
            />
          </div>
          <CopyButton text={signature}/>
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
