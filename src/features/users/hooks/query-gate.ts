import { useEntities, useEntity } from "@/hooks/use-query-hook";
import { TUsers } from "../schema/UserSchema";

const baseUrl = import.meta.env.VITE_USER_API;

// type props = {
//   endpoint: string;
//   id?: string;
//   key: string;
// };
const useUsers = (key: string, endpoint: string) => {
  const api = `${baseUrl}/${endpoint}`;
  const result = useEntities<TUsers>(key, api);
  return result;
};

const useUser = (endpoint: string, key: string, id?: string | null) => {
  const api = `${baseUrl}/${endpoint}`;

  const result = useEntity(key, api, id);
  return result;
};
export { useUsers, useUser };
