import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCompany,
  getCompanies,
  getCompanyById,
} from "../services/company-service";
import { TCompanyFullInfo } from "../schema/companySchema";
import { toast } from "react-toastify";
export const useCompanies = <T extends { id: string }>(key: string) => {
  const companies = useQuery<T[], Error>({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await getCompanies();
      return data;
    },
  });
  return { companies };
};

export const useCompany = <T extends { id: string }>(
  key: string,
  id: string | undefined | null
) => {
  const queryClient = useQueryClient();

  const invalidateActive = () =>
    queryClient.invalidateQueries({ queryKey: [key, "query"], type: "active" });

  const company = useQuery<T, Error>({
    queryKey: [key, id],
    queryFn: async () => {
      const { data } = await getCompanyById(id);

      return data;
    },
    enabled: !!id,
  });

  const add = useMutation<T, Error, TCompanyFullInfo, any>({
    mutationFn: async (newData: TCompanyFullInfo):Promise<T> => {
      const { data } = await addCompany(newData);
      return data;
    },
    onSuccess: (addedCompany) => {
      queryClient.setQueryData([key, addedCompany.id], addedCompany);
      queryClient.setQueryData([key], (cachedCompanies: T[] | undefined) =>
        cachedCompanies ? [...cachedCompanies, addedCompany] : undefined
      );
      toast.success("Company added successfully");
      invalidateActive();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    add,
    company,
  };
};
