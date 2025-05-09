//public routes
import Home from "../pages/User/Home";
import Admin from "../components/Layout/Admin";
import Product from "../pages/User/Product/Products";
import ProductDetails from "../pages/User/Product/ProductDetails";
import Cart from "../pages/User/Cart";
import Pay from "../pages/User/Pay";
import PayDetails from "../pages/User/Pay/PayDetails";
import Introduce from "../pages/User/Introduce";
import Contact from "../pages/User/Contact";
import HomeAd from "../pages/Admin/Home";
import Category from "../pages/Admin/Category";
import Account from "../pages/Admin/Account/Account";
import Chat from "../pages/Admin/Chat";



const publicRoutes = [
    {
        path: '/', component: Home
    },
    {
        path: '/products', component: Product
    },
    {
        path: '/products/:productId', component: ProductDetails
    },
    {
        path: '/Cart', component: Cart
    },
    {
        path: '/Pay', component: Pay
    },
    {
        path: '/PayDetails', component: PayDetails
    },
    {
        path: '/contact', component: Contact
    },
    {
        path: '/introduce', component: Introduce
    },
    {
        path: '/Admin', component: HomeAd, layout: Admin
    },
    {
        path: '/Admin/Category', component: Category, layout: Admin
    },
    {
        path: '/Admin/Account', component: Account, layout: Admin
    },
    {
        path: '/Admin/Chat', component: Chat, layout: Admin
    },

];

const privateRoutes = [];

export {
    publicRoutes, privateRoutes
};