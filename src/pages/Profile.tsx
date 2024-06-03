import { ProfilePage, useUserHook } from "@/features/users";
import { useParams } from "react-router-dom";

export const Profile = () => {
  const { id } = useParams();
  console.log("asdsad")
  if (!id) return null;
  const { useUserInfoHook } = useUserHook(id);

  if (!useUserInfoHook.data) return <div>No Data</div>;

  return <ProfilePage {...useUserInfoHook.data} />;
};
