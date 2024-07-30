import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCurrentUserId } from './use-user-hook';

const baseUrl = import.meta.env.VITE_TRANSACTION_API;

const fetchNotifications = async () => {
    const id = getCurrentUserId();
  const response = await axios.get(`${baseUrl}/v2/${id}/notification`);
  return response.data;
};


export const useNofications = () => {
  return useQuery({
    queryKey: ["notification"],
    queryFn: fetchNotifications
  });
};