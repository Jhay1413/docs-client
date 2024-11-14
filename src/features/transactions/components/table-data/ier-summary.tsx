import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { DocumentTable } from "./document-table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { useCurrentUserFirstName } from "@/hooks/use-user-hook";

import { filesQuerySchema } from "shared-contract";
import withRole, { WithRoleProps } from "@/components/HOC/component-permission";
import { FilePenLine } from "lucide-react";

type Props = {
  data: z.infer<typeof filesQuerySchema>[];
  percentage: number;
};
const WithRoleButton = ({ className, Icon, callbackFn, label }: WithRoleProps) => {
  return (
    <button className={className} onClick={callbackFn} type="button">
      <div className="">{Icon && <Icon size={20} />}</div>
      <div className="text-sm ">
        <h1>{label}</h1>
      </div>
    </button>
  );
};

const RoleButton = withRole(WithRoleButton);
export const IerPage = ({ data, percentage }: Props) => {
  const name = useCurrentUserFirstName();
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });

  const forwardFunction = () => {
    navigate(`/dashboard/transactions/update/${id}?mode=reattach`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-end py-4 ">
        <div className="flex justify-start gap-4">
          <RoleButton
            roles={["RECORDS"]}
            Icon={FilePenLine}
            className="flex justify-start items-center w-full gap-2 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md"
            label="Update"
            callbackFn={forwardFunction}
          />
          <Button variant="default" className="px-4 py text-white" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center" ref={componentRef}>
        <DocumentTable data={data} percentage={percentage} />
        <div className="show-print hidden">
          <h1 className="text-muted-foreground text-lg">Generated by:</h1>
          <h1 className="text-lg font-semibold">{name}</h1>
        </div>
      </div>
    </div>
  );
};
