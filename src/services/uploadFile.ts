import axios from "axios"

const transactionApi = import.meta.env.VITE_TRANSACTION_API

export const uploadMultipleFiles = async (data:FormData) => {
    try {
        const response = await axios.get(`${transactionApi}/upload`,data)
        return response
    } catch (error) {
        console.log(error)
        throw new Error("Error uploading files")
    }
}