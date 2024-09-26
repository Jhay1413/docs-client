import { z } from "zod";
import { departmentEntities } from "../schema/TransactionSchema";
import { useMemo } from "react";

const useForwardedToUser = (data: z.infer<typeof departmentEntities>[] | undefined, role: string, selectedDivision: string, team?: string) => {
    
    return useMemo (()=>{

        console.log(role,team,selectedDivision)
        if (!data) return [];

        const filters: Record<string, (data: z.infer<typeof departmentEntities>[]) => z.infer<typeof departmentEntities>[]> = {
          RECORDS: (data) => data.filter(d =>( d.division === selectedDivision && d.role === "MANAGER") || d.role==="QA"),
          QA : (data)=>data.filter(d=>d.role === "RECORDS"),
          MANAGER: (data) => data.filter(d =>
            (d.division === selectedDivision && d.section === team && d.role === "TL") ||
             d.role === "RECORDS"),
            TL : (data) => data.filter(d=> (d.division === selectedDivision && d.role == "MANAGER") ||(d.role === "CH" && d.section === team)),
            CH : (data) => data.filter(d=>d.division === selectedDivision && d.section === team && d.role === "TL")
        }
        const filterFunction = filters[role];
        if (!filterFunction) return []; 
    
        return filterFunction(data);
    },[data, role, selectedDivision, team])
}

export {
    useForwardedToUser
}