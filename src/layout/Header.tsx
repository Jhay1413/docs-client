import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { notification } from "@/features/transactions/schema/TransactionSchema";
import { useNotificationStore } from "@/global-states/notification-store";
import { getCurrentUserId, useCurrentUserFirstName } from "@/hooks/hooks/use-user-hook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { Bell, Dot, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const userFirstName = useCurrentUserFirstName();
  const id = getCurrentUserId();
  const { allNotification } = useNotificationStore();
  const numOfUnreadNotif = allNotification?.filter(data=>data.isRead === false).length;
  const[openNotif,setOpenNotif]= useState(false);


  const openNotification = () =>{
    setOpenNotif(!openNotif)
  }
  return (
    <div className="flex w-full justify-between shadow-lg">
      <div className="flex items-center ml-6 ">
        <h1 className="text-green-500 text-[30px]">DTS</h1>
      </div>
      <div className="flex items-center mr-6">
        <div className="flex justify-center items-center">
          <div className="w-[400px] h-[77px] relative ">
            <div className="flex w-full h-full">
              <div className="flex w-full justify-end items-center">
                <Button className="flex justify-center items-center relative" variant="link" onClick={openNotification}>
                  <Bell className="text-green-500 w-[65px] h-[45px]" />
                  <span className="absolute top-0 right-4 text-red-500 font-black">{numOfUnreadNotif ? numOfUnreadNotif : ""}</span>
                </Button>
              </div>
              {openNotif && <div className="absolute h-[500px] w-full border top-full rounded-lg">
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
                              className="w-[45px] rounded-full"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <Link to={`/dashboard/transactions/incoming-transaction/${id}`} className="flex flex-col gap-2">
                            <h1 className="text-sm">{data.message}</h1>
                            <h1 className="text-muted-foreground text-sm">
                              {new Date(data.createdAt).toDateString()}
                            </h1>
                          </Link>
                          {!data.isRead && <div className="flex items-center justify-end  ">
                            <Dot className="text-green-500" size={32} />
                          </div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">No notifications</div>
                  )}
                </ScrollArea>
              </div>}
            </div>
          </div>
          <Settings className="text-green-500 w-[65px] h-[45px]" />

          <h1 className="flex  text-[15px] p-1">{userFirstName}</h1>
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="w-[45px] rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
