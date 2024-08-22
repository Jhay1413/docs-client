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
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
    <div className="flex justify-start w-full flex-col ">
      <h1 className="text-[#404041] font-medium text-[28px]">
        List of Accounts
      </h1>
      <p className="text-muted-foreground text-[12px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing.
      </p>
    </div>
   
      <DataTable columns={accountColumn} data={useAccountHook.data}></DataTable>
    </div>
  );
};
