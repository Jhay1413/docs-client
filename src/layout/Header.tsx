import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/global-states/notification-store";
import useSidebarState from "@/global-states/sidebar-function-store";
import {
  getCurrentUserId,
  useCurrentUserFirstName,
} from "@/hooks/hooks/use-user-hook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { Bell, Dot, ListCollapse, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const userFirstName = useCurrentUserFirstName();
  const id = getCurrentUserId();
  const { allNotification } = useNotificationStore();
  const { open, setIsOpen } = useSidebarState();
  const numOfUnreadNotif = allNotification?.filter(
    (data) => data.isRead === false
  ).length;
  const [openNotif, setOpenNotif] = useState(false);

  const openNotification = () => {
    setOpenNotif(!openNotif);
  };
  const setSideBarState = () => {
    setIsOpen(!open);
  };
  return (
    <div className="flex w-full between items-center ">
      <div className="flex w-full ">
        <button
          className="flex justify-center items-center relative rounded-full bg-white w-[44px] h-[44px] transition-transform duration-300"
          onClick={setSideBarState}
          type="button"
        >
          <ListCollapse
            className={`w-[20px] h-[20px] transform transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
      <div className="flex items-center justify-end w-full  mr-6">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[400px] h-[77px] relative ">
            <div className="flex w-full h-full">
              <div className="flex w-full justify-end items-center">
                <button
                  className="flex justify-center items-center relative rounded-full bg-white  w-[44px] h-[44px] "
                  onClick={openNotification}
                >
                  <Bell className=" w-[20px] h-[20px]" />
                  <span className="absolute top-0 right-0 text-red-500">
                  {numOfUnreadNotif ?  <Dot absoluteStrokeWidth size={25}/> : ""}
                  </span>
                </button>
              </div>
              {openNotif && (
                <div className="absolute h-[500px] w-full  top-full rounded-lg z-10">
                  <ScrollArea className="flex w-full h-full flex-col gap-4 bg-white">
                    {allNotification && allNotification.length > 0 ? (
                      allNotification.map((data) => (
                        <div
                          key={data.id}
                          className={`flex items-center py-4 px-2 border-b-2 border-black/10 ${
                            !data.isRead && "bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar>
                              <AvatarImage
                                src="https://github.com/shadcn.png"
                                className="w-[45px] h-[45px] rounded-full"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Link
                              to={`/dashboard/transactions/incoming-transaction/${id}`}
                              className="flex flex-col gap-2"
                            >
                              <h1 className="text-sm">{data.message}</h1>
                              <h1 className="text-muted-foreground text-sm">
                                {new Date(data.createdAt).toDateString()}
                              </h1>
                            </Link>
                            {!data.isRead && (
                              <div className="flex items-center justify-end  ">
                                <Dot className="text-green-500" size={32} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">No notifications</div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
          <button className="flex justify-center items-center relative rounded-full bg-white  w-[44px] h-[44px]">
            <Settings className=" w-[20px] h-[20px]" />
          </button>
          <div className="flex  items-center justify-center">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="w-[45px] rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="flex  text-[15px] p-1">{userFirstName}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
