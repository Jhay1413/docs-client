import axios from "axios";

const userApi = import.meta.env.VITE_USER_API;

type TUpdateUserInfoApi = {
  formData: FormData;
  id: string;
};

export const getAccountInfoApi = async () => {
  try {
    const response = await axios.get(`${userApi}/account`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong while fetching account !");
  }
};

export const getUserInfo = async (id: string) => {
  try {
    const response = await axios.get(`${userApi}/user/${id}`);
    console.log(response)
    return response.data;
  } catch (error) {}
};
export const getUsersInfo = async () => {
  try {
    const response = await axios.get(`${userApi}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Something went wrong while fetching user !");
  }
};

export const updateUserInfoAPI = async ({
  id,
  formData,
}: TUpdateUserInfoApi) => {
  try {
    const response = await axios.put(`${userApi}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while updating user !");
  }
};
export const registerUserApi = async (data: FormData) => {
  try {
    const response = await axios.post(`${userApi}/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error);
      throw new Error(error.response.data.message);
    }

    throw new Error("Something went wrong while creating user !");
  }
};
export const updateUserProfile = async ({
  id,
  formData,
}: TUpdateUserInfoApi) => {
  try {
    const response = await axios.put(
      `${userApi}/changeProfile/${id}`,
      formData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
