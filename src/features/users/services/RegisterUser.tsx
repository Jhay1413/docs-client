import axios from "axios";
const userApi = import.meta.env.VITE_USER_API;
export const registerUser = async (data:FormData) => {
  try {
    const response = await axios.post(`${userApi}/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error)
      throw new Error(error.response.data.message)
    }
   
    throw new Error ("Something went wrong while creating user !");
  }
};
