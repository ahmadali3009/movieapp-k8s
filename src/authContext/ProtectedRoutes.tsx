import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>; // or spinner
  }

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes
