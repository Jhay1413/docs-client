import { useQuery } from "@tanstack/react-query";
import { TDcoumentInfo } from "../schema/TransactionSchema";
import { getDocuments } from "../services/transactionApi";

export function useTransactions(){
    return useQuery<TDcoumentInfo[]>({
        queryKey:['documentInfo'],
        queryFn: getDocuments,
    })
}