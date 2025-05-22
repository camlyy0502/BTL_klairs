import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes/Routes';
import User from './components/Layout/User';
import ProtectedRoute from './routes/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import ScrollToTop from './ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductManager from './pages/Admin/ProductManager';
import OrderManager from './pages/Admin/OrderManager';
import BotScenariosPage from './pages/Admin/BotScenarios/Bot';
import { CartProvider } from './contexts/CartContext';
function App() {


  return (
    <CartProvider>
      <Router>
        <ScrollToTop></ScrollToTop>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          {
            publicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = User;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
              // Wrap admin routes with ProtectedRoute
              const isAdminRoute = route.path.startsWith('/admin');
              const element = (
                <Layout>
                  <Page />
                </Layout>
              );
              return <Route key={index} path={route.path} element={
                isAdminRoute ? <ProtectedRoute>{element}</ProtectedRoute> : element
              } />;
            })
          }
          <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><OrderManager /></ProtectedRoute>} />
          <Route path="/admin/bot" element={<ProtectedRoute><BotScenariosPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
