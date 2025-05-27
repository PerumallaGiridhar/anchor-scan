import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CopyButton({ text, varient }: { text: string, varient?: "ghost" | "outline" | "default" | "secondary" }) {
  const [open, setOpen] = useState(false)
  const [icon, setIcon] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setOpen(true)
    setIcon(true)
    setTimeout(() => setOpen(false), 500)
    setTimeout(() => setIcon(false), 1000)
  }

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={varient}
            onClick={handleCopy}
          >
            {icon ? <Check /> : <Copy/>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Copied!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
