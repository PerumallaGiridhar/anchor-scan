import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNetworkStore } from "@/stores/useNetworkStore"
import { Input } from "./ui/input"

export const SelectNetwork = () => {
    const network = useNetworkStore((s) => s.network)
    const setNetwork = useNetworkStore((s) => s.setNetwork)
    const options = useNetworkStore((s) => s.options)
    const customRpcUrl = useNetworkStore((s) => s.customRpcUrl)
    const setCustomRpcUrl = useNetworkStore((s) => s.setCustomRpcUrl)
    return (
        <div className="flex flex-row gap-2 items-center">
            <img src="/solanaLogoMark.svg" alt="Solana Logo" className="w-7 h-7" />
            <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Network" />
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
                    {network === "custom" && (
                        <div className="px-3 py-2">
                            <Input
                                value={customRpcUrl}
                                onChange={(e) => setCustomRpcUrl(e.target.value)}
                                placeholder="Enter RPC URL"
                                className="text-sm"
                            />
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}