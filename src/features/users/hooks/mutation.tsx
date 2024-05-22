
import { useMutation } from "@tanstack/react-query";
import { registerUserApi, updateUserInfoAPI } from "../services/UserServices";

export function useRegisterUserMutation() {

  return useMutation({
    mutationFn: registerUserApi,
  });
}
export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: updateUserInfoAPI,
    
  });
}
