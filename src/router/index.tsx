import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"
import Admin from "../pages/admin/Admin";
import Ceo from "../pages/ceo/Ceo";
import App from "../App";
import Order from "../pages/ceo/Order";
import OrderDetail from "../pages/ceo/OrderDetail";

const routes = [
    {path: '/', element: <Home />},
    {path: '/admin', element: <Admin />},
    {path: '/ceo', element: <Ceo />},
    {path: '/ceo/orders', element: <Order />},
    {path: '/ceo/orders/:orderId/detail', element: <OrderDetail/>},
    
    

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