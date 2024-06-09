import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectRoute;
