import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { userInfoColumns } from "./user-columns";

import { DataTable } from "@/components/data-table";


import { useUsers } from "../hooks/query-gate";
import useRealtimeStore from "@/global-states/real-time-notification";

export const UserList = () => {
 
  const { entities } = useUsers("users", "/");
 
  if (!entities.data) {
    return "";
  }
  
  
  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full flex-col ">
        <h1 className="text-[#404041] font-medium text-[28px]">
          List of Users
        </h1>
        <p className="text-muted-foreground text-[12px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing.
        </p>
      </div>
      <div className="flex  bg-black w-full relative">
     
          <div className="absolute bottom-0 top-4">
            <Link
              to="/dashboard/users/form"
              className="bg-[#414140] px-4 py-2 text-lg flex  items-center justify-center space-x rounded-lg text-white"
            >
              <Plus size={24} />
              <h1>Add Users</h1>
            </Link>
          </div>
        
      </div>
      <DataTable columns={userInfoColumns} data={entities.data}></DataTable>
    </div>
  );
};
