import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCurrentUserId } from './use-user-hook';

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

const fetchNotifications = async () => {
    const id = getCurrentUserId();
  const response = await axios.get(`${baseUrl}/v2/${id}/notification`);
  return response.data;
};
const fetchAllNotifications = async()=>{
  const id = getCurrentUserId();
  const response = await axios.get(`${baseUrl}/v2/${id}/notifications`);
  console.log(response)
  return response.data;
}
const readAllNotifications = async ()=>{
  const id = getCurrentUserId();
  const response = await axios.put(`${baseUrl}/v2/${id}/readNotification`);
  console.log(response)
  return response.data;
}
export const useNofications = () => {
  return useQuery({
    queryKey: ["notification"],
    queryFn: fetchNotifications
  });
};
export const useAllNotications = () => {
  return useQuery({
    queryKey: ["allNotificaions"],
    queryFn: fetchAllNotifications,
    enabled:false
  });
};

export const useReadAllNotifications = () =>{
  return useMutation({
    mutationFn:readAllNotifications,
  });
}