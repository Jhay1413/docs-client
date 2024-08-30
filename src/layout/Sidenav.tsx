import {
  ClipboardList,
  Factory,
  FileCode,
  FileText,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  UserRoundPlus,
  UserSearch,
  Users
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import { logoutUser } from "@/features/authentication";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { useNotificationStore } from "@/global-states/notification-store";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export const SideNav = () => {
  const notification = useNotificationStore((state) => state.notification);
  const queryClient = useQueryClient();
  console.log(notification);
  const id = getCurrentUserId();

  const navigate = useNavigate();

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
    <div className="flex flex-col gap-4 w-full min-h-full pb-8 ">
       <div className="flex items-center justify-center h-32 ">
        <img src="/Logov6.png" className="h-[32px] w-[151px] " />
      </div>
      <div className="flex flex-col w-full min-h-full items-center gap-6">
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">
          MENU
        </Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2 ">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/overview`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <LayoutDashboard size={28} className="" />
              <h1 className="text-base">Dashboard</h1>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to="/dashboard/companies"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <Factory />

              <h1 className="text-base">Companies</h1>
            </NavLink>
          </li>
        </ul>
        
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">
          USERS & ACCOUNTS
        </Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to="/dashboard/users/users-list"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <Users />
              <h1 className="text-base">List of Users</h1>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to="/dashboard/users/userAccount"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <UserSearch />

              <h1 className="text-base">List of Accounts</h1>
            </NavLink>
          </li>
        </ul>
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">
          TRANSACTIONS
        </Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to="/dashboard/transactions/list"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <FileText />

              <h1 className="text-base">Transactions</h1>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/transactions/inbox/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <LibraryBig />
              <div className="flex gap-2">
                <h1 className="text-base">Inbox</h1>
                {notification?.inbox !== 0 && (
                  <span className="text-red-700 text-sm font-extrabold">
                    {notification?.inbox}
                  </span>
                )}
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/transactions/incoming-transaction/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <ClipboardList />
              <div className="flex gap-2">
                <h1 className="text-base">Incoming files</h1>
                {notification?.incoming !== 0 && (
                  <span className="text-red-700 text-sm font-extrabold">
                    {notification?.incoming}
                  </span>
                )}
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/transactions/archived`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                  isActive ? "bg-green-100/30 text-white" : ""
                }`;
              }}
            >
              <FileCode />
              <div className="flex gap-2">
                <h1 className="text-base">Archive</h1>
              </div>
            </NavLink>
          </li>
        </ul>
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">
          SETTINGS
        </Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2 ">
          <li className="relative inline-block text-left text-sm px-4">
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md"
            >
              <LogOut />
              <h1 className="text-base font-normal">Logout</h1>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};
