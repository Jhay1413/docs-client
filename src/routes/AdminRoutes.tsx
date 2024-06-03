import { PrivateAdminRoute } from "@/components/routeGuard/PrivateAdminRoute";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TransactionForm, TransactionList } from "@/features/transactions";
import { UserAccountList, UserFormIndex, UserList } from "@/features/users";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, Routes } from "react-router-dom";

const adminQueryClient = new QueryClient();
export const AdminRoutes = () => {
  return (
    <QueryClientProvider client={adminQueryClient}>
      <PrivateAdminRoute>
        <div className="flex flex-col min-h-screen min-w-screen bg-[#f4f4f4]">
          <div className="flex flex-none w-full min-h-[77px] bg-white z-10">
            <Header />
          </div>

          <div className="grow flex max-h-full   ">
            <div className="flex-none w-[250px] bg-white ">
              <SideNav />
            </div>
            <div className="grow overflow-auto flex items-center justify-center px-2 ">
              <ScrollArea className="h-[calc(100vh-90px)] bg-white w-full rounded-sm p-8">
                <Routes>
                  <Route path="/overview" element={<Dashboard />} />
                  <Route path={`/profile/:id`} element={<Profile />} />
                  <Route path={`/userAccount`} element={<UserAccountList />} />
                  <Route path={`/users`} element={<UserList />} />
                  <Route path={`/userForm/:id`} element={<UserFormIndex />} />
                  <Route path="/userForm" element={<UserFormIndex />} />
                  <Route
                    path="/transactionForm"
                    element={<TransactionForm />}
                  />
                  <Route path="/transactions" element={<TransactionList />} />
                </Routes>

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </PrivateAdminRoute>
    </QueryClientProvider>
  );
};
