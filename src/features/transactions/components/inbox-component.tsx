import { DataTable } from "@/components/data-table";
import { useParams } from "react-router-dom"
import { inboxColumn } from "./table-columns/inbox-column";


export const InboxComponent = () =>{
    const {id} = useParams();

    

    return(
        <div className="flex flex-col gap-y-6">
            <span><h1>Inbox</h1></span>
            
            {/* <DataTable columns={inboxColumn} data ={}/> */}
        </div>
    )
}