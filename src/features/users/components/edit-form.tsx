import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TUserWithAccount, TUsers } from "../schema/UserSchema";
import { z } from "zod";
import { useUserMutation } from "../hooks/mutation";
import { toast } from "react-toastify";
export const EditForm = (userInfo: TUserWithAccount) => {
  const { useUpdateUserMutation } = useUserMutation();
  const form = useForm<TUsers>({
    defaultValues: {
      id: userInfo.id,
      employeeId: userInfo.employeeId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      middleName: userInfo.middleName,
      assignedDivision: userInfo.assignedDivision,
      assignedSection: userInfo.assignedSection,
      assignedPosition: userInfo.assignedPosition,
      jobStatus: userInfo.jobStatus,
      dateStarted: userInfo.dateStarted,
      birthDate: userInfo.birthDate,
      email:userInfo.email,
      contactNumber:userInfo.contactNumber

    },
  });

  const onSuccess = () => {
    toast.success("User updated successfully !");
  };
  const onError = () => {
    toast.error("Error while updating user info !");
  };
  const appendToFormData = (data: TUsers) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "dateStarted" || key === "birthDate") {
        const zodDate = z.date().parse(value);
        formData.append(key, zodDate.toISOString());
      } else {
        formData.append(key, value as string);
      }
    });
    return formData;
  };
  const handleSubmit: SubmitHandler<TUsers> = async (data) => {
    const { dateStarted, birthDate, ...rest } = data;

    const converted_birthDate = new Date(birthDate);
    const converted_dateStarted = new Date(dateStarted);

    const newData = {
      birthDate: converted_birthDate,
      dateStarted: converted_dateStarted,
      ...rest,
    };
    const formData = appendToFormData(newData);

    useUpdateUserMutation.mutate(
      { formData, id: userInfo.id },
      {
        onSuccess,
        onError,
      }
    );
  };
  return (
    <>
      <div className="flex flex-col w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-3 gap-4 w-full">
              <FormInput
                name="firstName"
                label="First Name"
                placeholder="First Name"
              />
              <FormInput
                name="middleName"
                label="Middle Name"
                placeholder="Middle Name"
              />
              <FormInput
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
              />
              <FormInput
                name="assignedDivision"
                label="Division"
                placeholder="Division"
              />
              <FormInput
                name="assignedSection"
                label="Section"
                placeholder="Section"
              />
              <FormInput
                name="assignedPosition"
                label="Position"
                placeholder="Position"
              />
              <FormInput
                name="jobStatus"
                label="Job Status"
                placeholder="Job Status"
              />
              <FormInput
                name="dateStarted"
                label="Date Started"
                placeholder="Date Started"
                type="date"
              />
              <FormInput
                name="birthDate"
                label="Birthdate"
                placeholder="Birthdate"
                type="date"
              />
               <FormInput
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                
              />
               <FormInput
                name="contactNumber"
                label="Contact Number"
                placeholder="Contact Number"
                type="string"
                
              />
            </div>
            <div className="flex items-center justify-center mb-2 mt-12">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
