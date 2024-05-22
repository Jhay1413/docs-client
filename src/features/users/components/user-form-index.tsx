import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { UserForm } from "./Forms";
import { TUserForm } from "../schema/UserSchema";

export const UserFormIndex = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const data: TUserForm[] = queryClient.getQueryData(["user-info"]) || [];

  const user = data?.find((user: any) => user.id === id);

  console.log(user);

  return (
    <div className="flex w-full h-full">
      {user ? <UserForm user={user} /> : <UserForm />}
    </div>
  );
};
