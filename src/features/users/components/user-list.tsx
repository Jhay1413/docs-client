import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { userInfoColumns } from "./user-columns";

import { DataTable } from "@/components/data-table";

import { useUsers } from "../hooks/UserHook";

export const UserList = () => {
  const { users } = useUsers();

  if (users.isLoading) {
    return <div>Loading...</div>;
  }
  if (users.isError) {
    console.log(users.error);
    return <div>Error...</div>;
  }
  if (!users.data) {
    return <div>No Data</div>;
  }

  const data = users.data;
  return (
    <div className="flex flex-col w-full items-center justify-center bg-white rounded-lg">
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
