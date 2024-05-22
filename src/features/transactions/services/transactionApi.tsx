import axios from "axios";
import { TtransactionDetails } from "../schema/TransactionSchema";

const transactionApi = import.meta.env.VITE_TRANSACTION_API
export const newTransaction = async (data: TtransactionDetails) => {
    try {
        const response = await axios.post(`${transactionApi}/`,data)
        return response
    } catch (error) {
        console.log(error)
        throw new Error("Error uploading files")
    }
}


export const getDocuments = async () => {
    try {
        const response = await axios.get(`${transactionApi}/`)
        return response.data.data
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching documents")
    }
}