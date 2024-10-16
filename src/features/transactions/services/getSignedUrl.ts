import axios from "axios";

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

const baseUrlV2 = import.meta.env.VITE_ENDPOINT;
export const getSignedUrlV2 = async (
  company: string,
  fileName: string,
  contentType: string,
): Promise<{ company: string; fileName: string; contentType: string; signedUrl: string; fileUrl: string }> => {
  try {
    const response = await axios.get(`${baseUrlV2}/aws/getSignedUrl`, {
      params: {
        company: company,
        fileName: fileName,
        fileType: contentType,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong !");
  }
};
export const getSignedUrl = async <T>(data: T[]): Promise<T[]> => {
  try {
    const response = await axios.post(`${baseUrl}/transactionSignedUrl`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong ! ");
  }
};
export const getSignUrlForView = async (key: string) => {
  try {
    const response = await axios.get(`${baseUrl}/transactionGetUrl?key=${key}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while requesting signedUrl !");
  }
};
