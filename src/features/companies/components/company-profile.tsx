import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

import { useLocation } from "react-router-dom";
import { CompanyInfo, contactPerson } from "../schema/companySchema";
import { z } from "zod";
export const CompanyProfile = () => {
  let { state } = useLocation();

  const company: z.infer<typeof CompanyInfo> = state.data;
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-90px)] bg-white">
      <div className="flex h-[200px] bg-blue-900">
        <div className="grid w-full grid-cols-2">
          <div className="flex items-center p-4 gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-white flex flex-col gap-2">
              <h1 className="text-4xl">{company.companyName}</h1>
              <h1>Company ID: {company.companyId}</h1>
              <h1>Address : {company.companyAddress}</h1>
            </div>
          </div>
          <div className="flex flex-col text-white gap-12">
            <div className="mt-4">
              <h1 className="text-2xl">Contact Person</h1>
            </div>
            
              <div className="flex  flex-col" >
                <h1>{company.contactPersons?.name}</h1>
                <h1>{company.contactPersons?.contactNumber}</h1>
              </div>
           
          </div>
        </div>
      </div>
      <div className="grow bg-slate-50 pb-8">
        <div className="flex flex-col mt-12 px-12 gap-8 ">
          {company &&
            company.companyProjects &&
            company.companyProjects.map((project,index) => (
              <div className="grid grid-cols-4 w-full min-h-48 p-8 rounded-lg bg-white gap-12" key={index}>
                <div className="">
                  <h1 className="font-semibold text-2xl">Project Overview</h1>
                </div>
                <div className="flex flex-col gap-4 ">
                  <div className="flex justify-start ">
                    <h1 className="text-2xl font-semibold">
                      {project.projectName}
                    </h1>
                  </div>
                  <div className="flex gap-4 ">
                    <h1 className="font-semibold">
                      Retainership:{project.retainer}
                    </h1>
                    <h1>No</h1>
                  </div>
                  <div className="flex gap-4 ">
                    <h1 className="font-semibold">Date expiry:</h1>
                    <h1>Null</h1>
                  </div>
                  <div className="flex flex-col ">
                    <h1 className="font-semibold">
                      Address:{project.projectAddress}
                    </h1>
                    <h1>Banilad</h1>
                  </div>
                </div>
                
                  <div className="flex flex-col gap-4 " key={index}>
                    <h1 className="text-2xl font-semibold">Contact Person</h1>
                    <div className="flex flex-col">
                      <h1 className="font-semibold">Name:</h1>
                      <h1>{project.contactPersons?.name}</h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-semibold">Contact Number:</h1>
                      <h1>{project.contactPersons?.contactNumber}</h1>
                    </div>
                  </div>
             

                <div className="relative w-full">
                  <Pencil className="absolute top-0 right-0" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
