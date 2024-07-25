import { useParams } from "react-router-dom"
import { z } from "zod";
import { filesSchema } from "../../schema/TransactionSchema";
import { DocumentTable } from "./document-table";

type Props = {
    data: z.infer<typeof filesSchema>[]
}
export const IerPage = ({data}:Props) =>{

    const {id} = useParams();
    console.log(id)
    return(
        <div>
            <DocumentTable data= {data}/>
        </div>  
    )
}