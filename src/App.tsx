import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"

import { Anchor } from 'lucide-react';
import { Outlet } from "react-router-dom";
import { Fund } from "./components/fund";
import { Feedback } from "./components/feedback";
import { SelectNetwork } from "./components/select-network";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col gap-6 mx-50 h-screen">
        <div className="flex justify-between p-6 items-center border-b-1">
          <div className="flex flex-row gap-2 items-center">
            <Anchor className="text-foreground" />
            <p className="text-3xl font-normal">Anchor Play</p>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <div className="flex flex-row gap-2">
              <Fund />
              <Feedback />
            </div>
            <SelectNetwork/>
            <ModeToggle />
          </div>
        </div>
        <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default App