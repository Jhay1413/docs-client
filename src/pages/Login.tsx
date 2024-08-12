import { LoginForm } from "../features/authentication";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@/hooks/custom-hook";

export const Login = () => {
  const navigate = useNavigate();
  const { isLoading, isError, data: isAuthenticated } = useIsAuthenticated();
  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while checking authentication
  }
  if (isAuthenticated) {
    navigate("/dashboard/overview");
    return null;
  }
  if(isError)
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-1">
      <div className="hidden w-full md:flex items-center justify-center p-4">
        <img src="frontlogo.png" alt="login" className="h-[420px] w-[680px] " />
      </div>
      <div className="flex p-4 lg:gap-8 items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center space-y-12 ">
          <div className="flex flex-col  w-full p-8 sm:p-2 lg:w-[600px] sm:h-[607px] bg-white shadow-2xl rounded-lg items-center justify-center lg:p-24">
            <h1 className="font-semibold text-[24px]">SIGNUP</h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};
