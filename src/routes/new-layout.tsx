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
    <div className="flex justify-start min-h-screen max-h-screen min-w-screen bg-[#f4f4f4] overflow-hidden">
      <div className="flex max-h-screen min-w-[250px] bg-secondaryColor rounded-r-xl text-white ">
        <ScrollArea className="flex max-h-screen w-full text-white ">
          <SideNav />
        </ScrollArea>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex w-full max-h-[77px]">
          <Header />
        </div>

        <ScrollArea className="min-h-full bg-white w-full rounded-sm p-8">
          <Outlet />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* <div className="flex flex-none w-full min-h-[77px] bg-white z-10">
        <Header />
      </div> */}
      {/* 
      <div className="grow flex max-h-full">
        <ScrollArea className="h-[calc(100vh-80px)] w-[250px] bg-secondaryColor text-white"></ScrollArea>
        <div className="grow overflow-auto flex items-center justify-center px-2 max-w-[calc(100vw-250px)] ">
          <ScrollArea className="h-[calc(100vh-90px)] bg-white w-full rounded-sm p-8">
            <Outlet />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div> */}
    </div>
  );
};
