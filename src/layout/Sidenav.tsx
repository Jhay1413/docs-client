import {
  AlertCircleIcon,
  BookCheck,
  ClipboardList,
  Factory,
  FileCode,
  FileText,
  LayoutDashboard,
  LibraryBig,
  Mailbox,
  Ticket,
  TicketPercent,
  TicketPlus,
  UserSearch,
  Users,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { useNotificationStore, useTicketNotificationStore } from "@/global-states/notification-store";
import { Label } from "@/components/ui/label";
import withRole from "@/components/HOC/component-permission";

const CompaniesMenu = () => (
  <li className="relative inline-block text-left px-4 ">
    <NavLink
      to="/dashboard/companies"
      className={({ isActive }) => {
        return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
      }}
    >
      <Factory />

      <h1 className="text-base">Companies</h1>
    </NavLink>
  </li>
);

const UserAndAccountsMenu = () => (
  <>
    <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">USERS & ACCOUNTS</Label>
    <ul className="flex flex-col  space-y-4 w-full   mx-2">
      <li className="relative inline-block text-left px-4 ">
        <NavLink
          to="/dashboard/users/users-list"
          className={({ isActive }) => {
            return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
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
            return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
          }}
        >
          <UserSearch />

          <h1 className="text-base">List of Accounts</h1>
        </NavLink>
      </li>
    </ul>
  </>
);
const CompaniesItemWithRole = withRole(CompaniesMenu);
const UserAndAccountWithRole = withRole(UserAndAccountsMenu);

export const SideNav = () => {
  const notification = useNotificationStore((state) => state.notification);
  const ticketNotification = useTicketNotificationStore((state) => state.ticketNotification);

  const id = getCurrentUserId();

  return (
    <div className="flex flex-col gap-4 w-full min-h-full pb-8 ">
      <div className="flex items-center justify-center h-32 ">
        <Link to={`/dashboard/overview`}>
          <img src="/Logov6.png" className="h-[32px] w-[151px] " />
        </Link>
      </div>
      <div className="flex flex-col w-full min-h-full items-center gap-6">
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">MENU</Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2 ">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/overview`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <LayoutDashboard size={28} className="" />
              <h1 className="text-base">Dashboard</h1>
            </NavLink>
          </li>
          <CompaniesItemWithRole roles={["SUPERADMIN", "MANAGER"]} exemptions={["Operations Department"]} />
        </ul>
        <UserAndAccountWithRole roles={["SUPERADMIN"]} exemptions={["Operations Department"]} />
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">TRANSACTIONS</Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to="/dashboard/transactions/list"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
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
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
              
            >

              <div className="relative">
                {notification?.inbox !== 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[14px] font-extrabold rounded-full w-5 h-5 bg-red-700">
                    {notification?.inbox}
                  </span>
                )}
                <LibraryBig />
              </div>
              
              <div className="flex gap-2">
                <h1 className="text-base">Inbox</h1>
                {/* {notification?.inbox !== 0 && <span className="text-red-700 text-sm font-extrabold">{notification?.inbox}</span>} */}
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/transactions/incoming-transaction/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <div className="relative">
                {notification?.incoming !== 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[14px] font-extrabold rounded-full w-5 h-5 bg-red-700">
                    {notification?.incoming }
                  </span>
                )}
                <ClipboardList />
              </div>
              
              <div className="flex gap-2">
                <h1 className="text-base">Incoming files</h1>
                {/* {notification?.incoming !== 0 && <span className="text-red-700 text-sm font-extrabold">{notification?.incoming}</span>} */}
              </div>
            </NavLink>
          </li>
        </ul>
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">TICKETS</Label>
        <ul className="flex flex-col space-y-4 w-full mx-2">
          <li className="relative inline-block text-left px-4">
            <NavLink
              to={`/dashboard/tickets/list`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <Ticket />
              <div className="flex gap-2">
                <h1 className="text-base">Tickets</h1>
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/tickets/inbox/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <div className="relative">
                {ticketNotification?.inboxTickets !== 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[14px] font-extrabold rounded-full w-5 h-5 bg-red-700">
                    {ticketNotification?.inboxTickets}
                  </span>
                )}
                <Mailbox />
              </div>
              <div className="flex gap-2">
                <h1 className="text-base">Inbox</h1>
                {/* {ticketNotification?.inbox != 0 && <span className="flex items-center justify-center text-red-700 text-[12px] font-extrabold rounded-full w-4 h-4 bg-white border border-red-700">{ticketNotification?.inbox }</span>} */}
              </div>
            </NavLink>
          </li>

          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/tickets/incoming/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <div className="relative">
                {ticketNotification?.incomingTickets !== 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[14px] font-extrabold rounded-full w-5 h-5 bg-red-700">
                    {ticketNotification?.incomingTickets}
                  </span>
                )}
                <TicketPlus />
              </div>
              
              <div className="flex gap-2">
                <h1 className="text-base">Incoming Tickets</h1>
                {/* {ticketNotification?.incoming != 0 && <span className="text-red-700 text-sm font-extrabold">{ticketNotification?.incoming }</span>} */}
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/tickets/pending-tickets/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <TicketPercent />
              <div className="flex gap-2">
                <h1 className="text-base">Pending Requests</h1>
              </div>
            </NavLink>
          </li>
        </ul>
        <Label className="text-[#DCFF8E] px-4 font-medium flex w-full text-sm">ARCHIVE</Label>
        <ul className="flex flex-col  space-y-4 w-full   mx-2 ">
          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/transactions/archived`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <FileCode />
              <div className="flex gap-2">
                <h1 className="text-base">Archives</h1>
              </div>
            </NavLink>
          </li>

          <li className="relative inline-block text-left px-4 ">
            <NavLink
              to={`/dashboard/tickets/resolved-tickets`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${isActive ? "bg-green-100/30 text-white" : ""}`;
              }}
            >
              <BookCheck />
              <div className="flex gap-2">
                <h1 className="text-base">Resolved Tickets</h1>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
