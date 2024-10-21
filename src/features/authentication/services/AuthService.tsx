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

    return response;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data.message);
      throw new Error(error.response?.data.message || "Something went wrong while logging in !");
    } else {
      throw new Error("Something went wrong while logging in !");
    }
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.post(`${authApi}/dashboardGateApi`, {});

    return response;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Something went wrong while logging in !");
    } else {
      throw new Error("Something went wrong while logging in !");
    }
  }
};
export const logoutUser = async () => {
  try {
    const response = await axios.get(`${authApi}/logout`);
    return response.data;
  } catch (error) {
    throw new Error("Something went wrong while logging out !");
  }
};
