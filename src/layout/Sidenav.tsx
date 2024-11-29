import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useNotificationStore, useTicketNotificationStore } from "@/global-states/notification-store";
import {
  Factory,
  Users,
  UserSearch,
  LayoutDashboard,
  FilePen,
  FileText,
  ClipboardList,
  LibraryBig,
  Ticket,
  TicketPercent,
  TicketPlus,
  WalletCards,
  FileCode,
  BookCheck,
  BookKey,
  BookType,
  Mailbox,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import withRole from "@/components/HOC/component-permission";
import { getCurrentUserId } from "@/hooks/use-user-hook";

const CollapsibleSection = ({ label, children, defaultExpanded = false }: { label: string; children: React.ReactNode, defaultExpanded: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <>
      <div
        className="cursor-pointer px-2 flex justify-between items-center gap-4 pb-2 border-b-2 border-transparent hover:border-b-white"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Label className="text-[#DCFF8E] pl-2 font-medium flex w-full text-sm">{label}</Label>
        <span className="text-sm pr-4">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </span>
      </div>
      {isExpanded && <ul className="flex flex-col space-y-4 w-full ">{children}</ul>}
    </>
    
  );
};

const CompaniesMenu = () => (
  <li className="relative inline-block text-left px-2 ">
    <NavLink
      to="/dashboard/companies"
      className={({ isActive }) =>
        `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
          isActive ? "bg-green-100/30 text-white" : ""
        }`
      }
    >
      <Factory />
      <h1 className="text-base">Companies</h1>
    </NavLink>
  </li>
);

const CompaniesItemWithRole = withRole(CompaniesMenu);

export const SideNav = () => {
  const notification = useNotificationStore((state) => state.notification);
  const ticketNotification = useTicketNotificationStore((state) => state.ticketNotification);
  const id = getCurrentUserId();
  const location = useLocation();
  const previousPath = location.state?.from;

  return (
    <div className="flex flex-col gap-4 w-full min-h-full pb-8 ">
      <div className="flex items-center justify-center h-32">
        <Link to={`/dashboard/overview`}>
          <img src="/Logov6.png" className="h-[32px] w-[151px]" alt="Logo" />
        </Link>
      </div>
      <div className="flex flex-col  w-full min-h-full gap-6 pb-2">
        <CollapsibleSection label="MENU" defaultExpanded={true}>
          <li className="relative inline-block text-left px-2">
            <NavLink
              to={`/dashboard/overview`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/overview` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <LayoutDashboard size={28} />
              <h1 className="text-base">Dashboard</h1>
            </NavLink>
          </li>
          <CompaniesItemWithRole roles={["SUPERADMIN", "MANAGER"]} exemptions={["Operations Department"]}/>
        </CollapsibleSection>

        <CollapsibleSection label="USERS & ACCOUNTS" defaultExpanded={false}>
          <li className="relative inline-block text-left px-2">
            <NavLink
              to="/dashboard/users/users-list"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/users/users-list` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <Users />
              <h1 className="text-base">List of Users</h1>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-2">
            <NavLink
              to="/dashboard/users/userAccount"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/users/userAccount` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <UserSearch />
              <h1 className="text-base">List of Accounts</h1>
            </NavLink>
          </li>
        </CollapsibleSection>

        <CollapsibleSection label="TRANSACTIONS" defaultExpanded={false}>
          <li className="relative inline-block text-left px-2">
            <NavLink
              to="/dashboard/transactions/list"
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/transactions/list` || location.pathname.includes(`/dashboard/transactions/transaction-form`) ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <FileText />
              <h1 className="text-base">Transactions</h1>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-2">
            <NavLink
              to={`/dashboard/transactions/inbox/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/transactions/inbox/${id}` || location.pathname.includes(`/dashboard/transactions/history`) ||  location.pathname.includes(`/dashboard/transactions/update`) ? "bg-green-100/30 text-white" : ""}`;
                }
              }  
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
          <li className="relative inline-block text-left px-2">
            <NavLink
              to={`/dashboard/transactions/incoming-transaction/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/transactions/incoming-transaction/${id}` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
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
        </CollapsibleSection>

        <CollapsibleSection label="TICKETS" defaultExpanded={false}>
        <li className="relative inline-block text-left px-2">
          <NavLink
            to={`/dashboard/tickets/list`}
            className={({ isActive }) => {
              return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                isActive || previousPath === `/dashboard/tickets/list` ||
                location.pathname.includes('/dashboard/tickets/add-form') || 
                previousPath === `/dashboard/tickets/add-form` ? "bg-green-100/30 text-white" : ""}`;
              }
            }
          >
            <Ticket />
            <div className="flex gap-2">
              <h1 className="text-base">Tickets</h1>
            </div>
          </NavLink>
        </li>
        <li className="relative inline-block text-left px-2 ">
          <NavLink
            to={`/dashboard/tickets/inbox/${id}`}
            className={({ isActive }) => {
              return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md hover:bg-[#DCFCe74D] ${
                isActive || previousPath === `/dashboard/tickets/inbox/${id}` || location.pathname.includes(`/dashboard/tickets/forward-ticket`) 
                ?"bg-green-100/30 text-white" : ""}`;
              }
            }
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
            </div>
          </NavLink>
          </li>

          <li className="relative inline-block text-left px-2 ">
            <NavLink
              to={`/dashboard/tickets/incoming/${id}`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/tickets/incoming/${id}` ? "bg-green-100/30 text-white" : ""}`;
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
              </div>
            </NavLink>
          </li>
           <li className="relative inline-block text-left px-2 ">
             <NavLink
               to={`/dashboard/tickets/pending-tickets/${id}`}
               className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/tickets/pending-tickets/${id}` ? "bg-green-100/30 text-white" : ""}`;
               }}
             >
               <TicketPercent />
               <div className="flex gap-2">
                 <h1 className="text-base">Pending Requests</h1>
               </div>
             </NavLink>
           </li>
        </CollapsibleSection>

        <CollapsibleSection label="ARCHIVES" defaultExpanded={false}>
          <li className="relative inline-block text-left px-2 ">
            <NavLink
              to={`/dashboard/transactions/archived`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || location.pathname.includes(`/dashboard/transactions/update`) || previousPath === `/dashboard/transactions/archived` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <FileCode />
              <div className="flex gap-2">
                <h1 className="text-base">Archived Transactions</h1>
              </div>
            </NavLink>
          </li>

          <li className="relative inline-block text-left px-2 ">
            <NavLink
              to={`/dashboard/tickets/resolved-tickets`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/tickets/resolved-tickets` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <BookCheck />
              <div className="flex gap-2">
                <h1 className="text-base">Resolved Tickets</h1>
              </div>
            </NavLink>
          </li>
        </CollapsibleSection>

        <CollapsibleSection label="MANUALS" defaultExpanded={false}>
          <li className="relative inline-block text-left px-2 ">
            <NavLink
              to={`/dashboard/manuals/ticket-manual`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/manuals/ticket-manual` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <BookKey />
              <div className="flex gap-2">
                <h1 className="text-base">Ticket Manual</h1>
              </div>
            </NavLink>
          </li>
          <li className="relative inline-block text-left px-2 ">
            <NavLink
              to={`/dashboard/manuals/transaction-manual`}
              className={({ isActive }) => {
                return `justify-start items-center flex w-full p-2 space-x-4 text-lg rounded-md hover:bg-[#DCFCe74D] ${
                  isActive || previousPath === `/dashboard/manuals/transaction-manual` ? "bg-green-100/30 text-white" : ""}`;
                }
              }
            >
              <BookType />
              <div className="flex gap-2">
                <h1 className="text-base">Transaction Manual</h1>
              </div>
            </NavLink>
          </li>
        </CollapsibleSection>

      </div>
    </div>
  );
};

