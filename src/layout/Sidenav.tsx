import {
  BookUser,
  ChevronDown, LayoutDashboard,
  LibraryBig,
  UserRoundPlus
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { logoutUser } from "@/features/authentication";
import { useCurrentUserRole } from "@/hooks/use-user-hook";

export const SideNav = () => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const userRole = useCurrentUserRole();
  console.log(userRole);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onMutate: () => console.log("onMutate"),
    onSuccess: async (data) => {
      console.log(data);
      localStorage.clear();
      navigate("/");
    },
    onError: async () => console.log("onError"),
  });

  const logout = () => {
    mutation.mutate();
  };

  return (
    <div className="flex w-full min-h-full ">
      <ul className="flex flex-col mt-24 space-y-4 w-full   mx-2 text-gray-500">
        <li className="relative inline-block text-left px-4 ">
          <NavLink
            to={`/dashboard/overview`}
            className={({ isActive }) => {
              return `justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md ${
                isActive ? "bg-green-500 text-white" : ""
              }`;
            }}
          >
            <LayoutDashboard className="" />
            <h1 className="text-md">Dashboard</h1>
          </NavLink>
        </li>
        {userRole === "SUPERADMIN" && (
          <li className="relative inline-block text-left px-4 ">
            <button
              onClick={() => setIsUserOpen(!isUserOpen)}
              className="justify-between flex w-full p-2 text-lg  rounded-md"
            >
              <div className="justify-start flex  space-x-4 items-center">
                <UserRoundPlus />

                <h1 className="text-md">User</h1>
              </div>
              <div
                className={`transition-transform duration-500 transform ${
                  isUserOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown />
              </div>
            </button>
            {isUserOpen && (
              <div className=" flex w-full rounded-md  ml-4 border-l-2 border-gray-500">
                <div
                  className="py-1 flex flex-col gap-2  px-2  mr-4 w-full"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <NavLink
                    to="/dashboard/users"
                    className={({ isActive }) => {
                      return `w-full block px-4 py-2  rounded-md ${
                        isActive ? "bg-green-500 text-white" : ""
                      }`;
                    }}
                  >
                    <h1 className="text-md">User list</h1>
                  </NavLink>
                  <NavLink
                    to="/dashboard/userAccount"
                    className={({ isActive }) => {
                      return `w-full block px-4 py-2  rounded-md ${
                        isActive ? "bg-green-500 text-white" : ""
                      }`;
                    }}
                  >
                    <h1 className="text-md">Accounts</h1>
                  </NavLink>
                </div>
              </div>
            )}
          </li>
        )}

        <li className="relative inline-block text-left px-4 ">
          <button
            onClick={() => setIsTransactionOpen(!isTransactionOpen)}
            className="justify-between items-center flex w-full p-2 space-x-2 text-lg rounded-md"
          >
            <div className="justify-start flex items-center space-x-4">
              <LibraryBig />

              <h1 className="text-md">Transactions</h1>
            </div>
            <div
              className={`transition-transform duration-500 transform ${
                isTransactionOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown />
            </div>
          </button>
          {isTransactionOpen && (
            <div className=" flex w-full ml-4 rounded-md  border-l-2 border-gray-500 ">
              <div
                className="py-1 flex flex-col gap-2  px-2 mr-4 w-full"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <NavLink
                  to="/dashboard/transactions"
                  className={({ isActive }) => {
                    return `w-full block px-4 py-2  rounded-md ${
                      isActive ? "bg-green-500 text-white" : ""
                    }`;
                  }}
                >
                  <h1 className="text-md">Transaction list</h1>
                </NavLink>
                <NavLink
                  to="/dashboard/transactionForm"
                  className={({ isActive }) => {
                    return `w-full block px-4 py-2  rounded-md ${
                      isActive ? "bg-green-500 text-white" : ""
                    }`;
                  }}
                >
                  <h1 className="text-md">Add transaction</h1>
                </NavLink>
                <NavLink
                  to="/"
                  className={({ isActive }) => {
                    return `w-full block px-4 py-2  rounded-md ${
                      isActive ? "bg-green-500 text-white" : ""
                    }`;
                  }}
                >
                  <h1 className="text-md">Incoming files</h1>
                </NavLink>
              </div>
            </div>
          )}
        </li>

        <li className="relative inline-block text-left text-sm px-4">
          <Button
            variant="ghost"
            onClick={() => logout()}
            className="justify-start items-center flex w-full p-2 space-x-4 text-lg  rounded-md"
          >
            <BookUser />
            <h1 className="text-md font-normal">Logout</h1>
          </Button>
        </li>
      </ul>
    </div>
  );
};
