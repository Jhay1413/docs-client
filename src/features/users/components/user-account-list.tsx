import { DataTable } from "../../../components/data-table";
import { accountColumn } from "./account-columns";
import {  useUsers } from "../hooks/UserHook";

export const UserAccountList = () => {
    const {useAccountHook} = useUsers()

  if (useAccountHook.isLoading) {
    return <div>Loading...</div>;
  }
  if (useAccountHook.error) {
    return <div>Error...</div>;
  }
  if (!useAccountHook.data) {
    return <div>No Data</div>;
  }

  return (
    <div className="flex flex-col w-full items-center justify-center rounded-lg">
      <div className="flex justify-start w-full text-4xl">
        <h1>Account List</h1>
      </div>

      <DataTable columns={accountColumn} data={useAccountHook.data}></DataTable>
    </div>
  );
};
