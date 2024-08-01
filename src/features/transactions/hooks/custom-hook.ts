import { z } from "zod";
import { departmentEntities } from "../schema/TransactionSchema";
import { useMemo } from "react";

const useForwardedToUser = (data: z.infer<typeof departmentEntities>[] | undefined, role: string, selectedDivision: string, team?: string) => {

    return useMemo (()=>{
        if (!data) return [];

        const filters: Record<string, (data: z.infer<typeof departmentEntities>[]) => z.infer<typeof departmentEntities>[]> = {
          RECORDS: (data) => data.filter(d => d.division === selectedDivision && d.role === "MANAGER"),
          MANAGER: (data) => data.filter(d =>
            (d.division === selectedDivision && d.section === team && d.role === "TL") ||
            d.role === "RECORDS")
        }
        const filterFunction = filters[role];
        if (!filterFunction) return []; // Return empty array if role is not valid
    
        return filterFunction(data);
    },[data, role, selectedDivision, team])
}

export {
    useForwardedToUser
}