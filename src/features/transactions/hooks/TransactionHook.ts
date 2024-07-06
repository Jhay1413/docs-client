import { useQuery } from "@tanstack/react-query";
import { transactionData } from "../schema/TransactionSchema";
import { getDocuments } from "../services/transactionApi";
import { z } from "zod";

export function useTransactions(){
    return useQuery<z.infer<typeof transactionData>>({
        queryKey:['documentInfo'],
        queryFn: getDocuments,
    })
}