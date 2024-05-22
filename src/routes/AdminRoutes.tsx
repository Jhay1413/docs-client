import { PrivateAdminRoute } from "@/components/routeGuard/PrivateAdminRoute";
import { TransactionForm, TransactionList } from "@/features/transactions";
import { UserAccountList, UserFormIndex, UserList } from "@/features/users";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { Dashboard } from "@/pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



import { Route, Routes } from "react-router-dom";

const adminQueryClient = new QueryClient();
export const AdminRoutes = () => {
  return (
    <QueryClientProvider client={adminQueryClient}>
      <PrivateAdminRoute>
        <div className="grid grid-rows-[auto,1fr] w-full bg-[#F4F4F4] min-h-screen">
          <div className="flex w-full min-h-[77px] bg-white fixed z-10">
            <Header />
          </div>

          <div className="flex mt-[77px] h-[calc(100%-77px)]">
            <div className="w-[250px] bg-white fixed h-full">
              <SideNav />
            </div>
            <div className="flex grow w-full  ml-[250px] overflow-auto">
              <div className="flex w-full m-4  min-h-screen p-4">
                <Routes>
                  <Route path="/overview" element={<Dashboard />} />
                  <Route path={`/profile`} element={<Dashboard />} />
                  <Route path={`/userAccount`} element={<UserAccountList />} />
                  <Route path={`/users`} element={<UserList />} />
                  <Route path={`/userForm/:id`} element={<UserFormIndex />} />
                  <Route path="/userForm" element={<UserFormIndex />} />
                  <Route
                    path="/transactionForm"
                    element={<TransactionForm />}
                  />
                  <Route
                    path="/transactions"
                    element={<TransactionList />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </PrivateAdminRoute>
    </QueryClientProvider>
  );
};
