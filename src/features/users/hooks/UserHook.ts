import { useQuery } from "@tanstack/react-query"
import { TUsers } from "../schema/UserSchema"

import { getAccountInfoApi, getUserInfo } from "../services/UserServices"
import { TAccount } from "@/features/authentication"

export function useUserInfoHook(){
    return useQuery<TUsers[]>({
        queryKey:['user-info'],
        queryFn: getUserInfo,
    })
}

export function useAccountHook(){
    return useQuery<TAccount[]>({
        queryKey:['account-info'],
        queryFn:getAccountInfoApi,
    })

}