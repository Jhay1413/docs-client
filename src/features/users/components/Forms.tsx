import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";

import { toast } from "react-toastify";
import {
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../hooks/mutation";
import {
  RegisterSchema,
  TRegister,
  TUserForm,
  UserFormSchema,
} from "../schema/UserSchema";
import { Divisions } from "@/data/data";
import FormInput from "@/components/formInput";

type FormProps = {
  user?: TUserForm;
};
export const UserForm = ({ user }: FormProps) => {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");

  const updateUserMutaion = useUpdateUserMutation();
  const registerMutation = useRegisterUserMutation();

  const form = useForm<TRegister>({
    resolver: user ? zodResolver(UserFormSchema) : zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: user
      ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          assignedDivision: user.assignedDivision,
          assignedSection: user.assignedSection,
          assignedPosition: user.assignedPosition,
          dateStarted: user.dateStarted,
          jobStatus: user.jobStatus,
          accountRole: user.accountRole,
          employeeId: user.employeeId,
          contactNumber: user.contactNumber,
          password: "",
        }
      : undefined,
  });
  const onSuccess = () => {
    toast.success("User updated successfully");
    setSubmitting(false);
  };

  const onError = (error: any) => {
    toast.error(error?.message);
    setSubmitting(false);
  };

  const appendToFormData = (data: TRegister) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "imageFile") {
        formData.append(key, value as File);
      } else if (key === "dateStarted") {
        const date = new Date(value);
        const zodDate = z.date().parse(date);
        formData.append(key, zodDate.toISOString());
      } else {
        formData.append(key, value as string);
      }
    });
    return formData;
  };
  const onSubmit: SubmitHandler<TRegister> = (data) => {
    setSubmitting(true);

    const formData = appendToFormData(data);
    if (user && user.id) {
      updateUserMutaion.mutate(
        { formData, id: user.id },
        { onSuccess, onError }
      );
    } else {
      registerMutation.mutate(formData, { onSuccess, onError });
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 ">
      <div className="w-full  bg-white p-12 flex">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-12"
          >
            <div className="flex flex-col  items-center justify-center ">
              <div className="flex flex-col space-y-4">
                <Avatar className="w-[250px] h-[250px]">
                  <AvatarImage src={user ? user.signedUrl : preview} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(value) => {
                            if (value.target.files) {
                              setPreview(
                                URL.createObjectURL(value.target.files[0])
                              );
                              field.onChange(value.target.files[0]);
                            }
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <FormInput
                  name="employeeId "
                  label="Employee ID"
                  placeholder="Employee ID"
                />
                <FormField
                  control={form.control}
                  name="dateStarted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Started</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-center text-center font-normal"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Job Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PROBATION">PROBATION</SelectItem>
                            <SelectItem value="REGULAR">REGULAR</SelectItem>
                            <SelectItem value="PART-TIME">PART-TIME</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-rows-2 gap-4 ">
              <div className="grid grid-cols-3 gap-4    ">
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
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthdate</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-center text-center font-normal"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(date);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="assignedDivision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={
                            user ? user.assignedDivision : undefined
                          }
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
                              <SelectItem
                                key={division.name}
                                value={division.name!}
                              >
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
                  name="assignedSection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          disabled={!selectedDivision}
                          defaultValue={user ? user.assignedSection : undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                          <SelectContent>
                            {Divisions.find(
                              (division) => division.name === selectedDivision
                            )?.section.map((section) => (
                              <SelectItem
                                key={section.name}
                                value={section.name!}
                              >
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
                <FormField
                  control={form.control}
                  name="assignedPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={
                            user ? user.assignedPosition : undefined
                          }
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MANAGER">ADMIN</SelectItem>
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
              </div>
              <div className="">
                <Separator />
                <div className="grid grid-cols-2 gap-4   ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={user ? user.accountRole : undefined}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Account Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="SUPERADMIN">
                                SUPERADMIN
                              </SelectItem>
                              <SelectItem value="USER">USERS</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={() => console.log(form.formState.errors)}
                disabled={submitting}
              >
                {submitting ? "Submitting" : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
