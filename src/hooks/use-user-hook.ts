export function useCurrentDivision(){
    const userinfo = localStorage.getItem("userinfo");
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.assignedDivision;
    }
    return null;
}
export function useCurrentUserRole(){
    const userinfo = localStorage.getItem("userinfo");
    console.log(JSON.parse(userinfo!))
    if(userinfo){
        const data = JSON.parse(userinfo);
        return data.accountRole;
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