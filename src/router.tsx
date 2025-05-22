import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Welcome } from "./Welcome";
import { Scan } from "./scan";


const router = createBrowserRouter([
    {
        path: "/", 
        element: <App/>,
        children: [
            {path: "home", element: <Welcome/>},
            {path: "scan", element: <Scan/>}
        ]
    }
    
]);

export default router;