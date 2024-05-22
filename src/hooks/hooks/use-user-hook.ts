
import { TAccount } from "@/features/authentication";
import { TUsers, getAccountInfoApi, getUserInfo } from "@/features/users";
import { useQuery } from "@tanstack/react-query";

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
export function useCurrentUserRole(){
    const userinfo = localStorage.getItem("userinfo");
    console.log(JSON.parse(userinfo!))
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.accountType;
    }
    return null;
}
export function getCurrentUserId(){
    const userinfo = localStorage.getItem("userinfo");
    console.log(userinfo)
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.accountId;
    }
    return null;
}
export function useCurrentUserFirstName(){
    const userinfo = localStorage.getItem("userinfo");
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.name;
    }
    return null;
}