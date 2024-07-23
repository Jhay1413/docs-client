import { useEntities, useEntity } from "@/hooks/use-query-hook";

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

type TransactionType = {
  key: string;
  url: string;
  id?: string;
  method?: string;
  updateUrl?: string;
};
const useTransactions = <T extends { id?: string }>(
  key: string,
  endpoint: string
) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities<T>(key, api);
  return result;
};

const useTransaction = <T extends { id?: string }>({
  key,
  url,
  id,
  method,
  updateUrl,
}: TransactionType) => {
  const api = `${baseUrl}/${url}`;
  const updateApi = `${baseUrl}/${updateUrl}`
  console.log(baseUrl)
  const result = useEntity<T>(key,api,id,method, updateUrl =updateApi);
  return result;
};
export { useTransactions, useTransaction };
