
import axios from "axios";
import { TLogin } from "../schema/AuthSchema";

const authApi = import.meta.env.VITE_AUTH_API;
axios.defaults.withCredentials = true;
export const loginUser = async (data: TLogin) => {
  try {
    const response = await axios.post(`${authApi}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
    // throw new Error(error.response.data.message);
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.post(`${authApi}/dashboardGateApi`);
   
    return response
  } catch (error) {
    console.log(error)
    throw new Error("Unauthorized User");
  }
}
export const logoutUser = async () => {
  try {
    const response = await axios.get(`${authApi}/logout`);
    return response.data;
  } catch (error) {
    throw new Error("Something went wrong while logging out !");
  }
}