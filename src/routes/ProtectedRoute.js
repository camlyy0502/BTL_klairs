import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AccountApi from "../Api/Account/AccountApi";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [redirectRoot, setRedirectRoot] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await AccountApi.info();
        if (res.roles && res.roles.includes("CUSTOMER")) {
          // If user has 'CUSTOMER' role, logout and redirect
          await AccountApi.logout();
          if (isMounted) setRedirectRoot(true);
          return;
        }
        if (isMounted) setIsAuth(true);
      } catch (error) {
        if (isMounted) setIsAuth(false);
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (redirectRoot) return <Navigate to="/" replace />;
  if (!authChecked) return null; // or a loading spinner
  if (!isAuth) return <Navigate to="" replace />;
  return children;
};

export default ProtectedRoute;
