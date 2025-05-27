import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Welcome } from "./Welcome";
import { Playground } from "./playground";


const router = createBrowserRouter([
    {
        path: "/", 
        element: <App/>,
        children: [
            {path: "home", element: <Welcome/>},
            {path: "play/:address", element: <Playground/>}
        ]
    }
    
]);

export default router;