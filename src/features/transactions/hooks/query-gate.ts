import { useEntities, useEntity } from "@/hooks/use-query-hook";

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

const useTransactions = <T extends { id?: string }>(key: string, endpoint: string) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities<T>(key, api);
  return result;
};

const useTransaction = <T extends { id?: string }>(endpoint: string, key: string, id?: string | null,method?:string) => {
  const api = `${baseUrl}/${endpoint}`;

  const result = useEntity<T>(key, api, id,method);
  return result;
};
export { useTransactions, useTransaction };
  