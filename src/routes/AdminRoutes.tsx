import { RouteGuard } from "@/components/routeGuard/route-guard";
import { TransactionForm, TransactionList } from "@/features/transactions";
import { NotFound } from "@/pages/404";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

const AdminQueryClient = new QueryClient();
export const AdminRoutes = () => {
  return (
    <QueryClientProvider client={AdminQueryClient}>
      <RouteGuard allowedRole="ADMIN">
        <Routes>
          <Route path="/transactionForm" element={<TransactionForm />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </RouteGuard>
    </QueryClientProvider>
  );
};
