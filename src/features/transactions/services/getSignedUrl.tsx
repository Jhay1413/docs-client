import axios from "axios"
import { signedUrlData } from "../schema/TransactionSchema";
import { z } from "zod";
const baseUrl = import.meta.env.VITE_TRANSACTION_API;


export const getSignedUrl = async(data:z.infer<typeof signedUrlData>[])=>{

    try {
        const response = await axios.post(`${baseUrl}/transactionSignedUrl`,data);
        return response.data
    } catch (error) {
        console.log(error)
    }
}
