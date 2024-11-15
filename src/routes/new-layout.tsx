import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NotificationType, TicketNotificationType, useNotificationStore, useTicketNotificationStore } from "@/global-states/notification-store";
import useRealtimeStore from "@/global-states/real-time-notification";
import useSidebarState from "@/global-states/sidebar-function-store";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
const toastId = "notification-toast";
export const DashboardNewLayout = () => {
  const { socket } = useRealtimeStore();
  const currentUserId = getCurrentUserId();
  const { open } = useSidebarState();
  const setNumOfUnreadNotif = useNotificationStore((state) => state.setNumOfUnreadNotif);
  const setNotification = useNotificationStore((state) => state.setNotification);
  const setTicketNotification = useTicketNotificationStore((state) => state.setTicketNotification);

  useEffect(() => {
    console.log("SAdasds")
    socket.on("ticket-notification",(ticketTracker:TicketNotificationType)=>{
      console.log(ticketTracker)
      setTicketNotification(ticketTracker);
    })
    socket.on("notification", (message: string, quantityTracker: NotificationType, ticketTracker: TicketNotificationType) => {
      setNotification(quantityTracker);
      setTicketNotification(ticketTracker);
      if (message) {
        toast("🦄 You have new notification!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    });

    socket.emit("register", currentUserId);

    return () => {
      socket.off("notification");
      socket.off("ticket-notification")
    };
  }, [socket]);

  return (
    <div className="flex justify-start min-h-screen max-h-screen w-full bg-[#f4f4f4] overflow-hidden">
      <div className={`max-h-screen min-w-[250px] max-w-[250px] bg-secondaryColor rounded-r-xl text-white ${open ? "flex" : "hidden"}`}>
        <ScrollArea className="flex max-h-screen w-full text-white">
          <SideNav />
        </ScrollArea>
      </div>
      <div className={`flex flex-col flex-grow px-2 ${open ? "min-w-[calc(100%-250px)]" : "min-w-full"}`}>
        <div className="flex w-full max-h-[70px]">
          <Header />
        </div>
        <ScrollArea className="flex-grow p-4 my-2 overflow-auto">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
};
