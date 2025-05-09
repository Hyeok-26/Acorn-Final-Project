import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"
import Admin from "../pages/admin/Admin";
import Ceo from "../pages/ceo/Ceo";
import App from "../App";
import Class from "../pages/admin/Class";

const routes = [
    {path: '/', element: <Home />},
    {path: '/admin', element: <Admin />},
    {path: '/ceo', element: <Ceo />},
    {path:"/admin/class", element:<Class/>}
]

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: routes.map((route)=>{
        return {
            index: route.path === "/", 
            path: route.path === "/" ? undefined : route.path,
            element: route.element 
        }
    })
}])

export default router;