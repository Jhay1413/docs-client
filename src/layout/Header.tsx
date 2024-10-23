import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/global-states/notification-store";
import useSidebarState from "@/global-states/sidebar-function-store";
import { getCurrentUserId, useCurrentUserFirstName } from "@/hooks/hooks/use-user-hook";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Dot, ListCollapse, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/features/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationComponent } from "@/components/notification-component";
export const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { numOfUnreadNotif } = useNotificationStore();
  const userFirstName = useCurrentUserFirstName();
  const id = getCurrentUserId();
  const { open, setIsOpen } = useSidebarState();
  console.log(numOfUnreadNotif);
  const [openNotif, setOpenNotif] = useState(false);
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
              {openNotif && <NotificationComponent />}
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
