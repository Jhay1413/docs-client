import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { userInfoColumns } from "./user-columns";
import { useUserInfoHook } from "../hooks/UserHook";
import { DataTable } from "@/components/data-table";

export const UserList = () => {
  const { data, isLoading, isError } = useUserInfoHook();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error...</div>;
  }
  if (!data) {
    return <div>No Data</div>;
  }
  console.log(data);
  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
      <div className="flex justify-start w-full text-4xl">
        <h1>List of Users</h1>
      </div>
      <div className="justify-start w-full flex mt-12 ">
        <Link
          to="/dashboard/userForm"
          className="bg-black px-4 py-2 text-lg flex  items-center justify-center space-x-2 rounded-lg text-white"
        >
          <Plus size={24} />
          <h1>New User</h1>
        </Link>
      </div>
      <DataTable columns={userInfoColumns} data={data}></DataTable>
    </div>
  );
};
