import { useEntities, useEntity } from "@/hooks/use-query-hook";
import { transactionData } from "../schema/TransactionSchema";
import { z } from "zod";

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

type TransactionType = {
  key: string;
  url: string;
  id?: string;
  method?: string;
  updateUrl?: string;
};
const useTransactions = (
  key: string,
  endpoint: string
) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities(key, api);
  return result;
};

const useTransaction =({
  key,
  url,
  id,
  method,
  updateUrl,
}: TransactionType) => {
  const api = `${baseUrl}/${url}`;
  const updateApi = updateUrl ? `${baseUrl}/${updateUrl}` : undefined

  const result = useEntity(key,api,id,method, updateUrl =updateApi);
  return result;
};
export { useTransactions, useTransaction };
