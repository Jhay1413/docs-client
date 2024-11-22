import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ticketingMutationSchema } from "shared-contract";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { useState } from "react";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReimbursementForm from "./reimbursement-form";
import PurchaseRequestForm from "./purchase-request-form";

export const RequestForms = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const role = useCurrentUserRole();

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bs-white">
      <h1 className="text-4xl">Admin Request Forms</h1>
      {/* display all request forms */}
        <ReimbursementForm />
        <PurchaseRequestForm />
    </div>
  );
};

export default RequestForms;
