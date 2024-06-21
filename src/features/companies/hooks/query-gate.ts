import { useEntities, useEntity } from "@/hooks/use-query-hook";
import { TCompanyFullData, TCompanyFullInfo } from "../schema/companySchema";

const baseUrl = import.meta.env.VITE_COMPANY_API;

// type props = {
//   endpoint: string;
//   id?: string;
//   key: string;
// };
const useCompanies = (key: string, endpoint: string) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities<TCompanyFullData>(key, api);
  return result;
};

const useCompany = (endpoint: string, key: string, id?: string | null) => {
  const api = `${baseUrl}/${endpoint}`;

  const result = useEntity<TCompanyFullInfo>(key, api, id);
  return result;
};
export { useCompanies, useCompany };
