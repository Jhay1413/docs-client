import { z } from "zod";
import { departmentEntities } from "../schema/TransactionSchema";
import { useMemo } from "react";

const useForwardedToUser = (data: z.infer<typeof departmentEntities>[] | undefined, role: string, selectedDivision: string, team?: string | null) => {
  return useMemo(() => {
    if (!data) return [];

    const filters: Record<string, (data: z.infer<typeof departmentEntities>[]) => z.infer<typeof departmentEntities>[]> = {
      RECORDS: (data) =>
        data.filter(
          (d) => (d.division.toLowerCase() === selectedDivision.toLowerCase() && d.role === "MANAGER") || d.role === "QA" || d.role === "DMS",
        ),
      QA: (data) => data.filter((d) => d.role === "RECORDS"),
      DMS: (data) => data.filter((d) => d.division.toLowerCase() === selectedDivision.toLowerCase() && d.role === "MANAGER"),
      MANAGER: (data) =>
        data.filter((d) => {
          if (!team) {
            return d.division.toLowerCase() === selectedDivision.toLowerCase() && (d.role === "MANAGER" || d.role === "CH");
          }
          return (d.division.toLowerCase() === selectedDivision.toLowerCase() && d.section === team && d.role === "TL") || d.role === "RECORDS";
        }),
      TL: (data) =>
        data.filter(
          (d) => (d.division.toLowerCase() === selectedDivision.toLowerCase() && d.role == "MANAGER") || (d.role === "CH" && d.section === team),
        ),
      CH: (data) =>
        data.filter((d) => {
          if (d.division.toLowerCase() === selectedDivision.toLowerCase()) {
            return d.division.toLowerCase() === selectedDivision.toLowerCase() && d.role === "MANAGER";
          }
          d.division.toLowerCase() === selectedDivision.toLowerCase() && d.section === team && d.role === "TL";
        }),
    };
    const filterFunction = filters[role];
    if (!filterFunction) return [];

    return filterFunction(data);
  }, [selectedDivision, team]);
};

export { useForwardedToUser };
