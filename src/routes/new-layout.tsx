import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NotificationType, useNotificationStore } from "@/global-states/notification-store";
import useRealtimeStore from "@/global-states/real-time-notification";
import useSidebarState from "@/global-states/sidebar-function-store";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
const toastId = "notification-toast";
export const DashboardNewLayout = () => {
  const { socket } = useRealtimeStore();
  const currentUserId = getCurrentUserId();
  const { open } = useSidebarState();
  const setNumOfUnreadNotif = useNotificationStore((state) => state.setNumOfUnreadNotif);
  const setNotification = useNotificationStore((state) => state.setNotification);
  useEffect(() => {
    socket.on("notification", (numOfUnreadNotif: number, quantityTracker: NotificationType) => {
      setNotification(quantityTracker);
      setNumOfUnreadNotif(numOfUnreadNotif);
    });

    socket.emit("register", currentUserId);

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  return (
    <div className="flex justify-start min-h-screen max-h-screen w-full bg-[#f4f4f4] overflow-hidden ">
      <div className={`max-h-screen min-w-[250px] max-w-[250px] bg-secondaryColor rounded-r-xl text-white ${open ? "flex" : "hidden"}`}>
        <ScrollArea className="flex max-h-screen w-full text-white ">
          <SideNav />
        </ScrollArea>
      </div>
      <div className="flex flex-col min-w-[calc(100%-250px)] px-2">
        <div className="flex w-full max-h-[70px]">
          <Header />
        </div>

        <ScrollArea  className="min-h-[calc(100%-70px)] max-h-full w rounded-sm p-4 my-2 overflow-auto">
          <Outlet />
          {/* <ScrollBar orientation="horizontal" /> */}
        </ScrollArea>
      </div>
    </div>
  );
};
