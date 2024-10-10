import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import axios from "axios";
const userApi = import.meta.env.VITE_USER_API;

export const useUsers = <T>(
  key: string,
  url: string
) => {
  const users = useQuery<T[], Error>({
    queryKey: [key],
    queryFn: async ({ signal }): Promise<T[]> => {
      const { data } = await axios.get<T[]>(userApi + url, { signal });
      return data;
    },
  });
  return {
    users,
  };
};

export const useUser = <T extends { id: string }>(
  key: string,
  url: string,
  id: string | undefined | null
) => {
  const queryClient = useQueryClient();

  const invalidateActive = () => queryClient.invalidateQueries({ queryKey: [key, "query"], type: "active" });

  const user = useQuery<T, Error>({
    queryKey: [key, id],
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<T>(userApi + url + id, { signal });
      return data;
    },
    enabled: !!id,
  });

  const add = useMutation<T, Error, T, any>({
    mutationFn: async (user: T): Promise<T> => {
      const { data } = await axios.post<T>(url, user);
      return data;
    },
    onSuccess: (addedUser) => {
      queryClient.setQueryData([key, addedUser.id], addedUser);
      queryClient.setQueryData([key], (cachedUsers: T[] | undefined) =>
        cachedUsers ? [...cachedUsers, addedUser] : undefined
      );
      invalidateActive();
    },
  });

  const updateProfile = useMutation<T, Error, File, any>({
    mutationFn: async (img: File): Promise<T> => {
      const { data } = await axios.put<T>(userApi + url + id, img);

      return data;
    },
  });
  const update = useMutation<T, Error, T, any>({
    mutationFn: async (user: T): Promise<T> => {
      const { data } = await axios.put<T>(url + "/" + id, user);

      return data;
    },
    onSuccess: (updatedUser, variable) => {
      queryClient.setQueryData([key, id], updatedUser);
      queryClient.setQueryData([key], (cachedUsers: T[] | undefined) =>
        cachedUsers?.map((cachedUser) =>
          cachedUser.id === variable.id ? updatedUser : cachedUser
        )
      );

      invalidateActive();
    },
  });
  const remove = useMutation<string, Error, string, any>({
    mutationFn: async (id: string): Promise<string> => {
      const { data } = await axios.delete(url + "/" + id);
      return data;
    },
    onSuccess: (deleteId) => {
      queryClient.setQueryData([key, id], null);
      queryClient.setQueryData([key], (cachedUsers: T[] | undefined) =>
        cachedUsers?.filter((cachedUser) => cachedUser.id !== deleteId)
      );
      invalidateActive();
    },
  });
  return {
    user,
    add,
    update,
    remove,
    updateProfile,
  };
};
