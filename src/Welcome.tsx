import { SelectIdl } from "./components/select-idl"
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";



export const Welcome = () => {
    return (
        <div className="flex flex-col h-full items-center">
            <div className="flex flex-col h-1/5 w-2/5 justify-center">
                <div className="flex flex-row w-full gap-1 text-xl italic text-muted-foreground">
                    <FaQuoteLeft/> 
                    <p>Upload your IDL. Read your accounts.</p>
                </div>
                <div className="flex flex-row justify-end w-full text-xl italic text-muted-foreground">
                    <p>Debug your transactions — no boundaries. </p>
                    <FaQuoteRight/>
                </div>
            </div>
            <div className="flex flex-col w-full h-1/2 items-start justify-center gap-10">
                <p className="text-7xl">Welcome to Anchor Scan! <br/> <p className="text-7xl">A playground to visualize Solana Program's accounts.</p></p>
                <p className="text-md text-muted-foreground">Upload your anchor idl.json and select solana network to get started.</p>
                <SelectIdl />
            </div>
        </div>

    )
}