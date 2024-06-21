import { UserFormIndex } from "@/features/users";
import { NotFound } from "@/pages/404";
import { Login } from "@/pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, Routes } from "react-router-dom";

export function PublicRoutes() {
    return (
     
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/userForm" element={<UserFormIndex />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
     
    );
  }
