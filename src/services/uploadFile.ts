import axios from "axios"

const transactionApi = import.meta.env.VITE_TRANSACTION_API

export const uploadMultipleFiles = async (data:FormData) => {
    try {
        const response = await axios.post(`${transactionApi}/upload`,data)
        return response
    } catch (error) {
        throw new Error("Error uploading files")
    }
}