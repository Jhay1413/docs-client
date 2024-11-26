import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { getUserInfo } from "@/features/users";

type SignatoriesSectionProps = {
  form: any;
};

// Data for signatories
const SignatoriesSection: React.FC<SignatoriesSectionProps> = ({ form }) => {
  const userId = getCurrentUserId();
  const userInfo = getUserInfo(userId);
  
  const signatoryRoles = [
    { role: "requestor", label: "REQUESTED BY:", designation: "Requesting Staff" },
    { role: "checker", label: "CHECKED BY:", designation: "Team Leader" },
    { role: "preApprover", label: "PRE-APPROVED BY:", designation: "Department Manager" },
    // The last signatory with static data
    { role: "approver", label: "APPROVED BY:", designation: "Admin Manager", name: "ROSALINE VERANO" },
  ];

  return (
    <div className="px-24">
      <h3 className="text-lg font-semibold py-4 text-center">Signatories</h3>
      <div className="grid grid-cols-2 pb-20">
        {signatoryRoles.map((signatory, index) => (
          <div key={index} className="flex flex-col items-center space-y-4 py-8">
            {/* Signatory Label */}
            <h4 className="text-md font-medium py-8">{signatory.label}</h4>

            {/* Dynamic or Static Input Field */}
            {signatory.name ? (
              // Static Signatory
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-lg">{signatory.name}</span>
                <div className="border-t-2 border-gray-900 w-full mt-2"></div>
                <FormLabel className="mt-2 text-sm px-24 text-gray-500">{signatory.designation}</FormLabel>
              </div>
            ) : (
              // Dynamic Input Field for other signatories
              <FormField
                control={form.control}
                name={`signatories.${signatory.role}.name`}
                render={({ field }) => (
                  <FormItem>
                    {/* Input Field */}
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        className="text-center font-bold"
                      />
                    </FormControl>
                    <div className="border-t-2 border-gray-900 w-full mt-2"></div>

                    {/* Label for Role/Designation */}
                    <FormLabel className="mt-2 text-sm px-24 text-gray-500">
                        {signatory.designation}
                    </FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatoriesSection;
