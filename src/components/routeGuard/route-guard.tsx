import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useIsAuthenticated } from "@/hooks/custom-hook"; // Custom hook using TanStack Query

type PrivateProps = {
  children: ReactNode;
};

export const RouteGuard = ({ children }: PrivateProps) => {
  const navigate = useNavigate();
  const { isLoading, isError, data: isAuthenticated, error } = useIsAuthenticated();

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while checking authentication
  }

  if (isError) {
    toast.error(error.message);
    navigate("/"); // Redirect to login page
    return null; // Ensure the component doesn't render children while redirecting
  }

  return <>{children}</>; // Render children if authenticated
};
