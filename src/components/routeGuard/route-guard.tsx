
import { checkAuth } from "@/features/authentication";
import { useCurrentUserRole } from "@/hooks/use-user-hook";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


type PrivateProsp = {
    children: ReactNode;
    allowedRole:string
  };
  
export const RouteGuard = ({ children,allowedRole }: PrivateProsp) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const role =  useCurrentUserRole()
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkerAuth = async () => {
        try {
          await checkAuth();
          setIsAuthenticated(true);
          if(role !== allowedRole){
            toast.error("Unauthorized")
            navigate("/")
          }
        } catch (error) {
          toast.error("Unauthorized");
          navigate("/");
        }
      };
      checkerAuth();
    }, []);
  
    return isAuthenticated ?  <>{children}</> : <h1>asdasdasdsa</h1>;
  };