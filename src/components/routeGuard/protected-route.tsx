import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { useCurrentDivision } from "@/hooks/use-user-hook";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRoles: string[];
  exemptions?: string[];
};
const ProtectedRoute = ({ allowedRoles, exemptions }: Props) => {
  const userRole = useCurrentUserRole();
  const currentDivision = useCurrentDivision();
  if (allowedRoles.includes(userRole)) return <Outlet />;

  if (exemptions?.includes(currentDivision)) return <Outlet />;

  return <Navigate to="/dashboard/overview" />;
};

export default ProtectedRoute;
