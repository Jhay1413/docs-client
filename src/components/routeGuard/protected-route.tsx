import { useCurrentUserRole } from '@/hooks/hooks/use-user-hook';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = {
    allowedRoles : string[]
}
const ProtectedRoute = ({ allowedRoles}:Props) => {

const userRole = useCurrentUserRole();
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;