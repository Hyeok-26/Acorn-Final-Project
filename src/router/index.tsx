import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"
import Admin from "../pages/admin/Admin";
import Ceo from "../pages/ceo/Ceo";
import App from "../App";
import Inventory from "../pages/admin/Inventory";
import OrderList from "../pages/admin/OrderList";
import Order from "../pages/admin/Order";


const routes = [
    {path: '/', element: <Home />},
    {path: '/admin', element: <Admin />},
    {path: '/ceo', element: <Ceo />},
    {path: '/admin/inventory', element: <Inventory/>},
    {path: '/admin/order-list', element: <OrderList/>},
    {path: '/admin/order', element: <Order/>},
    {path: '/admin/:id/order', element: <Order/>}
    //{path: '/admin/:id/order', element: <OrderOld/>}
    
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