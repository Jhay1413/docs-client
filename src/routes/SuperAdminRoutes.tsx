import { RouteGuard } from "@/components/routeGuard/route-guard";
import { TransactionForm, TransactionList } from "@/features/transactions";
import { UserAccountList, UserFormIndex, UserList } from "@/features/users";
import { NotFound } from "@/pages/404";
import { Profile } from "@/pages/Profile";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, Routes } from "react-router-dom";

const superAdminQueryClient = new QueryClient();
export const SuperAdminRoutes = () => {
  return (
    <QueryClientProvider client={superAdminQueryClient}>
      <RouteGuard allowedRole="SUPERADMIN">
        <Routes>
          <Route path={`/profile/:id`} element={<Profile />} />
          <Route path={`/userAccount`} element={<UserAccountList />} />
          <Route path={`/users`} element={<UserList />} />
          <Route path={`/userForm/:id`} element={<UserFormIndex />} />
          <Route path="/userForm" element={<UserFormIndex />} />
          <Route path="/transactionForm" element={<TransactionForm />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteGuard>
    </QueryClientProvider>
  );
};
