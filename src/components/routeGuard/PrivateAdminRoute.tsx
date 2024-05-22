
import { checkAuth } from "@/features/authentication";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


type PrivateProsp = {
    children: ReactNode;
  };
  
export const PrivateAdminRoute = ({ children }: PrivateProsp) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkerAuth = async () => {
        try {
          await checkAuth();
          setIsAuthenticated(true);
        } catch (error) {
          toast.error("Unauthorized");
          navigate("/");
        }
      };
      checkerAuth();
    }, []);
  
    return isAuthenticated ? <>{children}</> : null;
  };