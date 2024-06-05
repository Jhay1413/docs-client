import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addCompany, getCompanies, getCompanyById } from "../services/company-service";


export const useCompanies  = <T extends {id:string}>(
  key:string,
)=>{
  const companies = useQuery<T[],Error>({
    queryKey: [key],
    queryFn: async()=>{
        const {data} = await getCompanies()
        return data
    }
  })
  return {companies}
}

export const useCompany = <T extends {id:string}>(
  key:string,
  id:string | undefined | null
)=>{
  const queryClient = useQueryClient();

  const invalidateActive = () => queryClient.invalidateQueries({queryKey:[key,"query"],type :"active"})

  const company = useQuery<T,Error>({
    queryKey:[key,id],
    queryFn:  async () =>{
      const {data} = await getCompanyById(id)

      return data
    },
    enabled: !!id
  },
  
  )

  const add = useMutation<T,Error,T,any>(
   {
    mutationFn : async(newData:T)=>{
          const {data} = await addCompany(newData)
      return data
    },
    onSuccess: (addedCompany)=>{
        queryClient.setQueryData([key,addedCompany.id],addedCompany);
        queryClient.setQueryData([key],(cachedCompanies:T[]| undefined)=>
        cachedCompanies ? [...cachedCompanies,addedCompany]: undefined);

        invalidateActive();
    }
   }

  );
  return {
    add,
    company
  }
}