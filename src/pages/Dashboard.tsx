import { useCurrentUserFirstName } from "@/hooks/use-user-hook";

export const Dashboard = () => {
    const currentUser = useCurrentUserFirstName();
    return (
      
        <div className="flex">
           <h1 className="text-[28px] font-semibold bg-gradient-to-r from-[#547326] to-[#93CB41] bg-clip-text text-transparent">Welcome back, {currentUser}!</h1>
        </div>
     
    );
  };
  
  