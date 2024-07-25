import { del, get, post, put } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export type EntityWithId = { id?: string };
export const useEntities = <T extends { id?: string }>(
  key: string,
  url: string
) => {
  const entities = useQuery<T[], Error>({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await get(url);

      return data;
    },
  });
  return { entities };
};

export const useEntity = <T extends { id?: string }>(
  key: string,
  url: string,
  id: string | undefined | null,
  method?: string,
  updateUrl?: string
) => {
  const queryClient = useQueryClient();

  const invalidateActive = () =>
    queryClient.invalidateQueries({ queryKey: [key, "query"], type: "active" });

  const entity = useQuery<T, Error>({
    queryKey: [key, id],
    queryFn: async () => {
      const { data } = await get(url, { id });

      return data;
    },
    enabled: !!id,
  });

  const add = useMutation<T, Error, T | FormData, any>({
    mutationFn: async (entity: T | FormData): Promise<T> => {
      const { data } = await post(url, entity);
      return data;
    },
    onSuccess: (entity) => {
      queryClient.setQueryData([key, entity.id], entity);
      queryClient.setQueryData([key], (cachedEntities: T[] | undefined) =>
        cachedEntities ? [...cachedEntities, entity] : undefined
      );
      toast.success("Data added successfully");
      console.log(queryClient.getQueryData([key]));
      invalidateActive();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const remove = useMutation<string, Error, string, any>({
    mutationFn: async (id: string): Promise<string> => {
      const { data } = await del(url, id);
      return data;
    },
    onSuccess: (deletedId) => {
      console.log(deletedId);
      queryClient.setQueryData([key, id], null);
      queryClient.setQueryData([key], (cachedEntities: T[] | undefined) =>
        cachedEntities?.filter((cachedEntity) => cachedEntity.id !== deletedId)
      );
      invalidateActive();
    },
  });
  const update = useMutation<T | string, Error, T | T[], any>({
    mutationFn: async (entity: T | T[]): Promise<T | string> => {
      console.log(url);
      const { data } = await put(updateUrl || url, entity);
      return data;
    },
    onSuccess: (updatedEntity) => {
      console.log(updatedEntity);
      if (method == "UPDATEREMOVE") {
        queryClient.setQueryData([key, updatedEntity], null);
        queryClient.setQueryData([key], (cachedEntities: T[] | undefined) =>
          cachedEntities?.filter(
            (cachedEntity) => cachedEntity.id !== updatedEntity
          )
        );
      } else {
        if (typeof updatedEntity !== "string") {

          queryClient.setQueryData([key, updatedEntity.id], updatedEntity);
          queryClient.setQueryData([key], (cachedEntities: T[] | undefined) =>
            cachedEntities?.map((cachedEntity) =>
              cachedEntity.id === updatedEntity.id ? updatedEntity : cachedEntity
            ) ?? []
          );
        }
      }
      toast.success("Data updated successfully");
      console.log(queryClient.getQueryData([key,id]));
      invalidateActive();
    },
    onError: (data) => {
      console.log(data);
    },
  });
  return {
    entity,
    add,
    remove,
    update,
  };
};
