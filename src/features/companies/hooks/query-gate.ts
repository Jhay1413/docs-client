import { useEntities, useEntity } from "@/hooks/use-query-hook";
import { CompanyInfo } from "../schema/companySchema";
import { z } from "zod";

const baseUrl = import.meta.env.VITE_COMPANY_API;

// type props = {
//   endpoint: string;
//   id?: string;
//   key: string;
// };
const useCompanies = (key: string, endpoint: string) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities<z.infer<typeof CompanyInfo>>(key, api);
  return result;
};

const useCompany = (endpoint: string, key: string, id?: string | null) => {
  const api = `${baseUrl}/${endpoint}`;

  const result = useEntity<z.infer<typeof CompanyInfo>>(key, api, id);
  return result;
};
export { useCompanies, useCompany };
