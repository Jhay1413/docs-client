import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/global-states/notification-store";
import useSidebarState from "@/global-states/sidebar-function-store";
import { getCurrentUserId, getCurrentUserInfoId, useCurrentUserFirstName } from "@/hooks/hooks/use-user-hook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Dot,
  ListCollapse,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/features/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentAccountId } from "@/hooks/use-user-hook";
export const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userFirstName = useCurrentUserFirstName();
  const id = getCurrentUserId();

  const { allNotification } = useNotificationStore();
  const { open, setIsOpen } = useSidebarState();
  const numOfUnreadNotif = allNotification?.filter((data) => data.isRead === false).length;
  const [openNotif, setOpenNotif] = useState(false);
  const userId = getCurrentAccountId();
  const openNotification = () => {
    setOpenNotif(!openNotif);
  };
  const setSideBarState = () => {
    setIsOpen(!open);
  };

  const logout = async () => {
    try {
      await logoutUser();
      queryClient.clear(); // Clear all query caches
      localStorage.clear(); // Clear localStorage
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <div className="flex w-full between items-center ">
      <div className="flex w-full ">
        <button
          className="flex justify-center items-center relative rounded-full bg-white w-[44px] h-[44px] transition-transform duration-300"
          onClick={setSideBarState}
          type="button"
        >
          <ListCollapse className={`w-[20px] h-[20px] transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
        </button>
      </div>
      <div className="flex items-center justify-end w-full  mr-6">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[400px] h-[77px] relative ">
            <div className="flex w-full h-full">
              <div className="flex w-full justify-end items-center">
                {/* Added hover in notification icon */}
                <button
                  className="flex justify-center items-center relative rounded-full bg-white w-[44px] h-[44px] hover:bg-gray-200"
                  onClick={openNotification}
                >
                  <Bell className="w-[20px] h-[20px]" />
                  <span className="absolute top-0 right-0 text-red-500">{numOfUnreadNotif ? <Dot absoluteStrokeWidth size={25} /> : ""}</span>
                </button>
              </div>
              {openNotif && (
                <div className="absolute h-[500px] w-full top-full rounded-lg z-10 bg-white">
                  <div className="p-4">Notifications</div>
                  <ScrollArea className="flex w-full h-full flex-col gap-4 bg-white rounded-lg pb-2 pr-2 pl-2">
                    {allNotification && allNotification.length > 0 ? (
                      allNotification.map((data) => (
                        <div key={data.id} className={`flex items-center py-4 px-2 border-b-2 border-black/10 ${!data.isRead && "bg-gray-100"}`}>
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" className="w-[45px] h-[45px] rounded-full object-cover" />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-1 w-full overflow-hidden">
                              <Link to={`/dashboard/transactions/incoming-transaction/${id}`} className="flex flex-col gap-2">
                                <h1 className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{data.message}</h1>
                                <h1 className="text-muted-foreground text-sm">{new Date(data.createdAt).toDateString()}</h1>
                              </Link>
                            </div>
                          </div>
                          {!data.isRead && (
                            <div className="flex items-center justify-end mr-2">
                              <Dot className="text-green-500" size={32} />
                            </div>
                          )}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" className="w-[45px] rounded-full" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to={`/dashboard/users/profile/${id}`} className="w-full h-full flex">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <h1 className="flex  text-[15px] p-1">{userFirstName}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
