import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PublicRoutes } from "./routes/PublicRoutes";
import { DashboardLayout } from "./routes/Layout";
import { Profile } from "./pages/Profile";
import { UserAccountList, UserForm, UserList } from "./features/users";
import { Users } from "./pages/user-index";
import {
  ArchivedList,
  HistoryComponent,
  InsertComponent,
  TransactionList,
  TransactionUpdateComponent,
} from "./features/transactions";
import { CompanyList } from "./features/companies";
import { NotFound } from "./pages/404";
import { Login } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyIndex } from "./pages/company-index";
import { AddComponent } from "./features/companies/components/add-component";
import { EditComponent } from "./features/companies/components/edit-component";
import { Dashboard } from "./pages/Dashboard";
import { TransactionIndex } from "./pages/transaction-index";
import { IncomingComponent } from "./features/transactions/components/table-data/incoming-component";
import { InboxComponent } from "./features/transactions/components/table-data/inbox-component";
import { ViewHistory } from "./features/transactions/components/view-history";
import { RouteGuard } from "./components/routeGuard/route-guard";
import { DashboardNewLayout } from "./routes/new-layout";
import ProtectedRoute from "./components/routeGuard/protected-route";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="font-roboto">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="dashboard/"
              element={
                <RouteGuard>
                  <DashboardNewLayout />
                </RouteGuard>
              }
            >
              <Route path="overview" element={<Dashboard />} />
              <Route path="users" element={<Users />}>
                <Route path={`profile/:id`} element={<Profile />} />
                <Route
                  element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} />}
                >
                  <Route path="users-list" element={<UserList />} />
                  <Route path="form" element={<UserForm />} />
                  <Route path={`userAccount`} element={<UserAccountList />} />
                </Route>
              </Route>
              <Route path="companies" element={<CompanyIndex />}>
                <Route index element={<CompanyList />} />
                <Route
                  element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} exemptions={['Operations Department']} />}
                >
                  <Route path="add-form" element={<AddComponent />} />
                  <Route path={`:id`} element={<EditComponent />} />
                </Route>
              </Route>
              <Route path="transactions" element={<TransactionIndex />}>
                <Route path="list" element={<TransactionList />} />
                <Route path="transaction-form" element={<InsertComponent />} />
                <Route path="history/:id" element={<HistoryComponent />} />
                <Route
                  path="incoming-transaction/:id"
                  element={<IncomingComponent />}
                />
                <Route path="inbox/:id" element={<InboxComponent />} />
                <Route
                  path="update/:id"
                  element={<TransactionUpdateComponent />}
                />
                <Route path="log/:id" element={<ViewHistory />} />
                <Route path="archived" element={<ArchivedList />} />
              </Route>
            </Route>
            <Route path="/" element={<PublicRoutes />}>
              <Route path="form" element={<Login />} />
              <Route index element={<UserForm />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
