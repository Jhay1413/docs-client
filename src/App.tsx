import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PublicRoutes } from "./routes/PublicRoutes";
import { DashboardLayout } from "./routes/Layout";
import { Profile } from "./pages/Profile";
import { UserAccountList, UserForm, UserList } from "./features/users";
import { Users } from "./pages/user-index";
import { InsertComponent, TransactionList } from "./features/transactions";
import { CompanyList } from "./features/companies";
import { NotFound } from "./pages/404";
import { Login } from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouteGuard } from "./components/routeGuard/route-guard";
import { CompanyIndex } from "./pages/company-index";
import { AddComponent } from "./features/companies/components/add-component";
import { EditComponent } from "./features/companies/components/edit-component";
import { Dashboard } from "./pages/Dashboard";

const queryClient = new QueryClient();
function App() {
  return (
    <>
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
                <RouteGuard allowedRole="SUPERADMIN">
                  <DashboardLayout />
                </RouteGuard>
              }
            >
              <Route path ="overview"element={<Dashboard/>}/>
              <Route path="users/" element={<Users />}>
                <Route path ="list" element={<UserList />} />
                <Route path="form" element={<UserForm />} />
                <Route path={`profile/:id`} element={<Profile />} />
                <Route path={`userAccount`} element={<UserAccountList />} />
             
              </Route>

              <Route path="companies/" element={<CompanyIndex />}>
                <Route index element={<CompanyList />} />
                <Route path="add-form" element={<AddComponent />} />
                <Route path = {`:id`} element={<EditComponent/>}/>
              </Route>

              <Route path="transactionForm" element={<InsertComponent/>} />
              <Route path="transactions" element={<TransactionList />} />
            </Route>

            <Route path="/" element={<PublicRoutes />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
