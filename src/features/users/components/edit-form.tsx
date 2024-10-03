import { Button } from "@/components/ui/button";
import { Divisions } from "@/data/data";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { TUserWithAccount, TUsers } from "../schema/UserSchema";
import { z } from "zod";
import { useUserMutation } from "../hooks/mutation";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
export const EditForm = (userInfo: TUserWithAccount) => {
  const [selectedDivision, setSelectedDivision] = useState("");

  const [position, setPosition] = useState("");

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
      email: userInfo.email,
      contactNumber: userInfo.contactNumber,
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

    const converted_birthDate = new Date(birthDate).toISOString();
    const converted_dateStarted = new Date(dateStarted).toISOString();

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
      },
    );
  };
  return (
    <>
      <div className="flex flex-col w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-3 gap-4 w-full">
              <FormInput name="firstName" label="First Name" placeholder="First Name" />
              <FormInput name="middleName" label="Middle Name" placeholder="Middle Name" />
              <FormInput name="lastName" label="Last Name" placeholder="Last Name" />
              <FormField
                control={form.control}
                name="assignedDivision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={userInfo ? userInfo.assignedDivision : field.value}
                        onValueChange={(value) => {
                          setSelectedDivision(value);
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                        <SelectContent>
                          {Divisions.map((division) => (
                            <SelectItem key={division.name} value={division.name!}>
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={userInfo ? userInfo.assignedPosition : field.value}
                        onValueChange={(value) => {
                          if (value === "MANAGER") {
                            form.setValue("assignedSection", null);
                          }
                          field.onChange(value);
                          setPosition(value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MANAGER">MANAGER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="TL">TL</SelectItem>
                          <SelectItem value="CH">CH</SelectItem>
                          <SelectItem value="STAFF">STAFF</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        disabled={!userInfo.assignedDivision || userInfo.assignedPosition == "MANAGER" || position == "MANAGER" || !selectedDivision}
                        defaultValue={userInfo ? userInfo.assignedPosition : ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {Divisions.find((division) => division.name === selectedDivision)?.section.map((section) => (
                            <SelectItem key={section.name} value={section.name!}>
                              {section.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormInput name="jobStatus" label="Job Status" placeholder="Job Status" />
              <FormInput name="dateStarted" label="Date Started" placeholder="Date Started" type="date" />
              <FormInput name="birthDate" label="Birthdate" placeholder="Birthdate" type="date" />
              <FormInput name="email" label="Email" placeholder="Email" type="email" />
              <FormInput name="contactNumber" label="Contact Number" placeholder="Contact Number" type="string" />
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
