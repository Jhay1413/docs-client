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
  if (isError)
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="hidden w-full md:flex items-center justify-center p-4 bg-[#404041]">
          <img
            src="envicomm-logo.png"
            alt="login"
            className="h-[420px] w-[680px] "
          />
        </div>
        <div className="flex flex-col ">
          <div className="w-full">
            <svg
              viewBox="0 0 1146 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M163.479 54.8182C113.355 58.8788 10.685 67 1 67V0H1146L903.874 14.2121L594.208 54.8182L278.807 67L163.479 54.8182Z"
                fill="#547326"
                stroke="#547326"
              />
              <path
                d="M163.479 38.4545C113.355 41.303 10.685 47 1 47V0H1146L903.874 9.9697L594.208 38.4545L278.807 47L163.479 38.4545Z"
                fill="#8CBF3F"
                stroke="#93CB41"
              />
              <path
                d="M163.479 24.5455C113.355 26.3636 10.685 30 1 30V0H1146L903.874 6.36364L594.208 24.5455L278.807 30L163.479 24.5455Z"
                fill="#BBD979"
                stroke="#93CB41"
              />
            </svg>
          </div>
          <div className="w-full flex flex-col items-center justify-center space-y-12 h-full">
            <h1 className="text-4xl">Document Tracking System</h1>
            <div className="flex flex-col  lg:w-[500px] sm:h-[550px] bg-white shadow-2xl px-[50px] rounded-lg items-center gap-8">
              <h1 className=" text-[28px] mt-16">Login</h1>
              <LoginForm />
            </div>
          </div>
          <div className="w-full flex items-end">
            <svg
              viewBox="0 0 1146 68"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180 w-full"
            >
              <path
                d="M163.479 54.8182C113.355 58.8788 10.685 67 1 67V0H1146L903.874 14.2121L594.208 54.8182L278.807 67L163.479 54.8182Z"
                fill="#547326"
                stroke="#547326"
              />
              <path
                d="M163.479 38.4545C113.355 41.303 10.685 47 1 47V0H1146L903.874 9.9697L594.208 38.4545L278.807 47L163.479 38.4545Z"
                fill="#8CBF3F"
                stroke="#93CB41"
              />
              <path
                d="M163.479 24.5455C113.355 26.3636 10.685 30 1 30V0H1146L903.874 6.36364L594.208 24.5455L278.807 30L163.479 24.5455Z"
                fill="#BBD979"
                stroke="#93CB41"
              />
            </svg>
          </div>
        </div>
      </div>
    );
};
