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
        throw new Error("Something went wrong ! ")
    }
}
export const getSignUrlForView = async(key:string)=>{
    try {
        const response = await axios.get(`${baseUrl}/transactionGetUrl?key=${key}`);
        return response.data
    } catch (error) {
        console.log(error)
    }
}