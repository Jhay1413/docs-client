import { useEntities, useEntity } from "@/hooks/use-query-hook";
import { TFormData } from "../schema/TransactionSchema";

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

const useTransactions = (key: string, endpoint: string) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities(key, api);
  return result;
};

const useTransaction = (endpoint: string, key: string, id?: string | null,method?:string) => {
  const api = `${baseUrl}/${endpoint}`;

  const result = useEntity(key, api, id,method);
  return result;
};
export { useTransactions, useTransaction };
