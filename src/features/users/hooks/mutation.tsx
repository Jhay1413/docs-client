import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUserApi,
  updateUserInfoAPI,
  updateUserProfile,
} from "../services/UserServices";

export function useUserMutation() {

  const queryClient = useQueryClient();

  const useRegisterUserMutation = useMutation({
    mutationFn: registerUserApi,
  });
  const useUpdateUserMutation = useMutation({
    mutationFn: updateUserInfoAPI,
  });
  const useUpdateProfileMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ["user-with-account", updatedUser.id],
        updatedUser
      );
      queryClient.invalidateQueries({queryKey:['users']})
    },
  });
  return {
    useRegisterUserMutation,
    useUpdateProfileMutation,
    useUpdateUserMutation,
  };
}
