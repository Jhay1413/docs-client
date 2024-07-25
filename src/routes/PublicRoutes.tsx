
import { UserForm } from "@/features/users";
import { NotFound } from "@/pages/404";
import { Login } from "@/pages/Login";

import { Route, Routes } from "react-router-dom";

export function PublicRoutes() {
    return (
     
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="form" element={<UserForm />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
     
    );
  }
