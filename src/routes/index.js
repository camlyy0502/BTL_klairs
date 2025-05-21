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
import Login from "../pages/User/Login";
import HomeAd from "../pages/Admin/Home";
import Category from "../pages/Admin/Category";
import Account from "../pages/Admin/Account/Account";
import Bot from "../pages/Admin/BotScenarios/Bot";
import OrderManager from "../pages/Admin/OrderManager";
import ProductManager from "../pages/Admin/ProductManager";
import Chat from "../pages/Admin/Chat";
import AddressPage from '../pages/User/Account/AddressPage';
import OrderPage from '../pages/User/OrderPage';
import OrderDetailPage from '../pages/User/OrderDetailPage';



const publicRoutes = [
    {
        path: '/login', component: Login
    },
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
        path: '/cart', component: Cart
    },
    {
        path: '/pay', component: Pay
    },
    {
        path: '/payDetails', component: PayDetails
    },
    {
        path: '/contact', component: Contact
    },
    {
        path: '/introduce', component: Introduce
    },
    {
        path: '/admin', component: HomeAd, layout: Admin
    },
    {
        path: '/admin/category', component: Category, layout: Admin
    },
    {
        path: '/admin/account', component: Account, layout: Admin
    },
    {
        path: '/admin/bot', component: Bot, layout: Admin
    },
    {
        path: '/admin/products', component: ProductManager, layout: Admin
    },
    {
        path: '/admin/orders', component: OrderManager, layout: Admin
    },
    {
        path: '/admin/chat', component: Chat, layout: Admin
    },
    {
        path: '/account/addresses', component: AddressPage
    },
    {
        path: '/orders', component: OrderPage
    },
    {
        path: '/orders/:id', component: OrderDetailPage
    }

];

const privateRoutes = [];

export {
    publicRoutes, privateRoutes
};