import { DataTable } from "@/components/data-table";
import { useParams } from "react-router-dom"
import { inboxColumn } from "./table-columns/inbox-column";
import { useTransaction, useTransactions } from "../hooks/query-gate";
import { transactionData } from "../schema/TransactionSchema";
import { z } from "zod";


export const InboxComponent = () =>{
    const {id} = useParams();
    const {entities} = useTransactions<z.infer<typeof transactionData>>("inbox",`/inbox/${id}`);


    if(!entities.data) return ""
    return(
        <div className="flex flex-col gap-y-6">
            <span><h1>Inbox</h1></span>
            
            <DataTable columns={inboxColumn} data ={entities.data}/>
        </div>
    )
}