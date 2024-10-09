import withRole, { WithRoleProps } from "@/components/HOC/component-permission";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { tsr } from "@/services/tsr";
import { Archive, FilePenLine, MessageSquareShare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNotificationStore } from "@/global-states/notification-store";
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
export const TransactionActions = ({ transactionId }: { transactionId: string }) => {
  const userId = getCurrentUserId();
  const [open, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const notification = useNotificationStore((state) => state.notification);
  const setNotification = useNotificationStore((state) => state.setNotification);

  const { mutate, isPending } = tsr.transaction.archivedTransation.useMutation({
    onSuccess: () => {
      toast.success("Data has been archived");
      setNotification({
        incoming: notification?.incoming !== 0 ? notification?.incoming! : 0,
        inbox: notification?.inbox !== 0 ? notification?.inbox! - 1 : 0,
      });
      navigate(`/dashboard/transactions/inbox/${userId}`);
    },
  });

  const forwardFunction = () => {
    navigate(`/dashboard/transactions/update/${transactionId}`);
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <RoleButton
        roles={["RECORDS"]}
        Icon={Archive}
        className="flex justify-start items-center w-full gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
        label="Archive"
        callbackFn={() => setIsOpen(!open)}
      />
      <RoleButton
        roles={["RECORDS", "QA", "CH", "TL", "MANAGER", "DMS"]}
        Icon={FilePenLine}
        className="flex justify-start items-center w-full gap-2 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md"
        label="Forward"
        callbackFn={forwardFunction}
      />

      <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Please check the transaction before archiving. This will move the transaction to the archive module.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                mutate({
                  params: { id: transactionId },
                  body: {
                    userId: userId,
                  },
                })
              }
              disabled={isPending}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
