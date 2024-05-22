
import { DataTable } from "../../../components/data-table";
import { accountColumn } from "./account-columns";
import { useAccountHook } from "../hooks/UserHook";

export const UserAccountList = () => {
  const { isLoading, error, data } = useAccountHook();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }
  if (!data) {
    return <div>No Data</div>;
  }
  console.log(data);

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
    <div className="flex justify-start w-full text-4xl">
        <h1>Account List</h1>
      </div>
      
      <DataTable columns={accountColumn} data={data}></DataTable>
    </div>
  );
};
