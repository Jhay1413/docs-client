import { useQuery } from "@tanstack/react-query";
import { TUserWithAccount, TUsers } from "../schema/UserSchema";

import {
  getAccountInfoApi,
  getUserInfo,
  getUsersInfo,
} from "../services/UserServices";
import { TAccount } from "@/features/authentication";

export function useUsers() {
  const users = useQuery<TUsers[]>({
    queryKey: ["users"],
    queryFn: getUsersInfo,
    staleTime: Infinity, 
  });
  const useAccountHook = useQuery<TAccount[]>({
    queryKey: ["account-info"],
    queryFn: getAccountInfoApi,
  });
  return {
    users,
    useAccountHook
  };
}
export function useUserHook(id: string) {
  const useUserInfoHook = useQuery<TUserWithAccount>({
    queryKey: ["user-with-account", id],
    queryFn: () => getUserInfo(id),
  });
 
  return {
    useUserInfoHook,
  };
}
