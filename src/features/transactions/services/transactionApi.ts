import axios from "axios";
const transactionApi = import.meta.env.VITE_TRANSACTION_API
// import { TFormData } from "../schema/TransactionSchema";

// export const newTransaction = async (data: TFormData) => {
//     try {
//         const response = await axios.post(`${transactionApi}/`,data)
//         return response
//     } catch (error) {
//         console.log(error)
//         throw new Error("Error uploading files")
//     }
// }


export const getDocuments = async () => {
    try {
        const response = await axios.get(`${transactionApi}/`)
        return response.data.data
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching documents")
    }
}