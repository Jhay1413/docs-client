
import { checkAuth } from "@/features/authentication";
import { useQuery } from "@tanstack/react-query";


export function useAuthCheckerHook() {
  return useQuery({
    queryKey: ['auth-checker'],
    queryFn: checkAuth,
    
  });
}