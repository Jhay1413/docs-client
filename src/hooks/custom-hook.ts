import { checkAuth } from "@/features/authentication";
import { useQuery } from "@tanstack/react-query";

export function useIsAuthenticated() {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: async () => {
      const {data} = await checkAuth();
      return data
    },
    staleTime:Infinity,
    retry:false,
    refetchOnMount:true
  });
}
  