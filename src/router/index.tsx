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
    {path: '/posts/:postId/edit', element:<PostUpdateForm/>}
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