import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { publicRoutes } from './routes';
import User from './components/Layout/User';
import ProtectedRoute from './routes/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import ScrollToTop from './ScrollToTop';
function App() {


  return (
    <Router>
      <ScrollToTop></ScrollToTop>
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
            const isAdminRoute = route.path.startsWith('/Admin');
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
      </Routes>
    </Router>
  );
}
export default App;
