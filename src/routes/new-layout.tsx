import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { notification } from "@/features/transactions/schema/TransactionSchema";
import {
  NotificationType,
  useNotificationStore,
} from "@/global-states/notification-store";
import useRealtimeStore from "@/global-states/real-time-notification";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
const toastId = "notification-toast";
export const DashboardNewLayout = () => {
  const { socket } = useRealtimeStore();
  const currentUserId = getCurrentUserId();
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
  const setAllNotification = useNotificationStore(
    (state) => state.setAllNotification
  );
  useEffect(() => {
    socket.on(
      "notification",
      (
        message: string,
        notifications: z.infer<typeof notification>[],
        quantityTracker: NotificationType
      ) => {
        setNotification(quantityTracker);
        setAllNotification(notifications);
        if (message) {
          toast(message, {
            position: "bottom-right",
            toastId: toastId,
          });
        }
      }
    );
    socket.emit("register", currentUserId);

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  return (
    <div className="flex justify-start min-h-screen max-h-screen min-w-screen bg-[#f4f4f4] overflow-hidden ">
      <div className="flex max-h-screen min-w-[250px] bg-secondaryColor rounded-r-xl text-white ">
        <ScrollArea className="flex max-h-screen w-full text-white ">
          <SideNav />
        </ScrollArea>
      </div>
      <div className="flex flex-col w-full px-2">
        <div className="flex w-full max-h-[70px]">
          <Header />
        </div>

        <ScrollArea className="max-h-full   bg-white w-full rounded-sm p-4 my-2">
          <Outlet />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};
