import axios from "axios"

const baseUrl = import.meta.env.VITE_TRANSACTION_API;


export const getSignedUrl = async <T>(data: T[]): Promise<T[]> => {

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