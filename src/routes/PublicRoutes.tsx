import { UserFormIndex } from "@/features/users";
import { Login } from "@/pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, Routes } from "react-router-dom";
const publicQueryClient = new QueryClient();
export function PublicRoutes() {
    return (
      <QueryClientProvider client={publicQueryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/userForm" element={<UserFormIndex />} />
        </Routes>
      </QueryClientProvider>
    );
  }
