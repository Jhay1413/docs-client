import axios from "axios";

const companyApi = import.meta.env.VITE_COMPANY_API;
export const getCompanies = async () => {
  try {
    const response = await axios.get(`${companyApi}/`);
    return response
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch companies");
  }
};
export const getCompanyById = async (id:any)=>{
    try {
        const response = await axios.get(`${companyApi}/${id}`)
        return response
    } catch (error) {
        throw new Error("Error while fetching !")
    }
}
export const addCompany = async(data:any)=>{
    try {
        const response = await axios.post(`${companyApi}/`, data);
        return response
    } catch (error) {
        throw new Error("Error while adding data !")
    }
}