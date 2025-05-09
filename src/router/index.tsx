import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home"
import Admin from "../pages/admin/Admin";
import Ceo from "../pages/ceo/Ceo";
import App from "../App";
import Code from "../pages/ceo/Code";
import Product from "../pages/ceo/Product";
import Store from "../pages/ceo/Store";
import Post from "../pages/ceo/Post";
import PostDetail from "../pages/ceo/PostDetail";
import PostUpdateForm from "../pages/ceo/PostUpdateForm";
import PostForm from "../pages/ceo/PostForm";

import OrderDetail from "@/pages/ceo/OrderDetail";
import Order from "@/pages/ceo/Order";

import OrderSale from "../pages/ceo/OrderSale";
import ViewSale from "../pages/ceo/ViewSale";
import Class from "@/pages/admin/Class";
import StudentList from "@/pages/admin/StudentList";
import ClassCalendar from "@/pages/admin/ClassCalendar";
import SalesManage from "@/pages/admin/SalesManage";
import SalesStatus from "@/pages/admin/SalesStatus";


const routes = [
    {path: '/', element: <Home />},
    {path: '/admin', element: <Admin />},
    {path: '/ceo', element: <Ceo />},
    {path: '/ceo/code', element:<Code/>},
    {path: '/ceo/product', element:<Product/>},
    {path: '/ceo/store', element:<Store/>},
    {path: '/posts', element:<Post/>},
    {path: '/posts/new', element:<PostForm/>},
    {path: '/posts/:postId', element:<PostDetail/>},
    {path: '/posts/:postId/edit', element:<PostUpdateForm/>},

    {path: '/ceo/orders', element:<Order/>},
    {path: '/ceo/orders/:orderId/detail', element:<OrderDetail/>},

    {path: '/ceo/ordersale', element:<OrderSale/>},
    {path: '/ceo/viewsale', element:<ViewSale/>},
    {path:"/admin/class", element:<Class/>},

    {path: '/admin/students', element:<StudentList/>},
    {path: '/admin/calendar', element:<ClassCalendar/>},
    {path: '/admin/salesmanage', element:<SalesManage/>},
    {path: '/admin/salesstat', element:<SalesStatus/>}
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