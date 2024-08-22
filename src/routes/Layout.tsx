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
const toastId= "notification-toast"
export const DashboardLayout = () => {
  const { socket, } = useRealtimeStore();
  const currentUserId = getCurrentUserId()
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
  const setAllNotification = useNotificationStore(
    (state) => state.setAllNotification
  );
  useEffect(()=>{
    socket.on(
        "notification",
        (
          message: string,
          notifications: z.infer<typeof notification>[],
          quantityTracker: NotificationType
        ) => {
            setNotification(quantityTracker)
            setAllNotification(notifications)
            if (message) {
              toast(message,{
                position:"bottom-right",
                toastId:toastId
              });
            }
          
        }
      );
      socket.emit("register", currentUserId);
  
      return () => {
        socket.off("notification");
      };

  },[socket])



  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-[#f4f4f4]">
      <div className="flex flex-none w-full min-h-[77px] bg-white z-10">
        <Header />
      </div>

      <div className="grow flex max-h-full">
        <ScrollArea className="h-[calc(100vh-80px)] w-[250px] bg-secondaryColor text-white">
          <SideNav />
        </ScrollArea>
        <div className="grow overflow-auto flex items-center justify-center px-2 ">
          <ScrollArea className="h-[calc(100vh-90px)] bg-white w-full rounded-sm p-8">
            <Outlet />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
