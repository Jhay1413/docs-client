import { DataTable } from "../../../components/data-table";
import { accountColumn } from "./account-columns";
import { useUsers } from "../hooks/UserHook";

export const UserAccountList = () => {
  const { useAccountHook } = useUsers();

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
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full flex-col ">
          <h1 className="text-[#404041] font-medium text-[28px]">
            List of Accounts
          </h1>
          <p className="text-muted-foreground text-[12px] truncate">
            View and manage all your accounts in one place. Easily access account
            details and perform necessary actions.
          </p>
        </div>

        <DataTable columns={accountColumn} hasSearch={true} data={useAccountHook.data} isSticky={true}></DataTable>
      </div>
    </div>
  );
};
