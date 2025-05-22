import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"


import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./components/ui/select"
import { Anchor } from 'lucide-react';
import { Outlet } from "react-router-dom";
import { Fund } from "./components/fund";
import { Feedback } from "./components/feedback";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col gap-6 mx-50 h-screen">
        <div className="flex justify-between p-6 items-center border-b-1">
          <div className="flex flex-row gap-2 items-center">
            <Anchor className="text-foreground" />
            <p className="text-3xl font-normal">Anchor Scan</p>
          </div>

          <div className="flex flex-row gap-6 items-center">
            <div className="flex flex-row gap-2">
              <Fund />
              <Feedback />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <img src="/solanaLogoMark.svg" alt="Solana Logo" className="w-7 h-7" />
              <Select>
                <SelectTrigger className="w-[180px]">
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
            <ModeToggle />
          </div>
        </div>
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App