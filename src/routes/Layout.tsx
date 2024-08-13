import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { notification } from "@/features/transactions/schema/TransactionSchema";
import { useNotificationStore } from "@/global-states/notification-store";
import useRealtimeStore from "@/global-states/real-time-notification";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";
import { useAllNotications, useNofications } from "@/hooks/use-custom-query";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { z } from "zod";

export const DashboardLayout = () => {
  const { socket } = useRealtimeStore();
  const { messages, addNotification } = useRealtimeStore();
  const currentUserId = getCurrentUserId();
  const setNotification = useNotificationStore(
    (state) => state.setNotification
  );
  const setAllNotification = useNotificationStore(
    (state) => state.setAllNotification
  );
  const allNotifications = useNotificationStore(
    (state) => state.allNotification
  );
  const setRefetch = useNotificationStore((state) => state.setRefetch);
  const setRefetchAll = useNotificationStore((state) => state.setRefetchAll);

  console.log("asdasd");
  //needs to revise terms used
  const { data, isLoading, error, refetch } = useNofications();
  const {
    data: allNotif,
    isLoading: allNotifLoading,
    error: errorNotif,
    refetch: refetchAll,
  } = useAllNotications();

  useEffect(() => {
    socket.on(
      "notification",
      (message: string, notifications: z.infer<typeof notification>[]) => {
        console.log(notifications);
        setAllNotification(notifications);
        toast(message);
      }
    );
    socket.emit("register", currentUserId);

    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    refetchAll();
  }, []);
  if (isLoading || allNotifLoading) return "loading";

  if (data) {
    setNotification(data);
    setRefetch(refetch);
  }
  if (allNotif) {
    console.log(allNotif);
    if (!allNotifications) {
      setAllNotification(allNotif);
      setRefetchAll(refetchAll);
    }
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-[#f4f4f4]">
      <div className="flex flex-none w-full min-h-[77px] bg-white z-10">
        <Header />
      </div>

      <div className="grow flex max-h-full">
        <ScrollArea className="h-[calc(100vh-90px)] w-[250px] bg-white mt-2">
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
