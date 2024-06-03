
import { TAccount } from "@/features/authentication";
import { getAccountInfoApi } from "@/features/users";
import { useQuery } from "@tanstack/react-query";


export function useAccountHook(){
    return useQuery<TAccount[]>({
        queryKey:['account-info'],
        queryFn:getAccountInfoApi,
    })

}
export function useCurrentUserRole(){
    const userinfo = localStorage.getItem("userinfo");
  
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.accountType;
    }
    return null;
}
export function getCurrentUserId(){
    const userinfo = localStorage.getItem("userinfo");
   
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