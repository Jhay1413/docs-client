import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { EditForm, TUserWithAccount } from "@/features/users";
import { ProfilePicture } from "./profile-picture";

export const ProfilePage = (userInfo: TUserWithAccount) => {
  const [isEdit, setIsEdit] = useState(false);

  const profileProps = {
    signedUrl: userInfo.signedUrl,
    id: userInfo.id,
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-90px)] bg-white gap-4 p-24">
      <div className="flex w-2/5  shadow-xl">
        <div className="w-full relative">
          <ProfilePicture {...profileProps} />
          <div className="flex flex-col gap-4 items-center   w-full justify-center mt-24">
            <h1 className="text-4xl">
              {userInfo.firstName +
                " " +
                userInfo.middleName +
                " " +
                userInfo.lastName}
            </h1>
            <h1 className="text-2xl">{userInfo.assignedPosition}</h1>
            <h1 className="text-2xl">{userInfo.assignedDivision}</h1>
          </div>
        </div>
      </div>
      <div className="flex grow flex-col gap-4">
        <div className="flex-none h-96  w-full shadow-xl bg-white">
          <div className="p-4 flex">
            <h1 className="text-xl font-bold">Account settings</h1>
          </div>
          <div className="relative">
            <Button className="absolute right-4 bottom-1 ">
              Change Password
            </Button>
          </div>
          <div className="flex grow w-full ">
            <div className="p-4 grid grid-rows-3 grid-cols-3  shadow-xl w-full m-4 gap-4">
              <div className="col-span-2 flex flex-col w-full gap-2 ">
                <Label>Email</Label>
                <Input value={userInfo.account.email} readOnly />
              </div>

              <div className="col-span-2 flex flex-col  w-full gap-2 ">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={userInfo.account.password}
                  readOnly
                />
              </div>
              <div className="col-span-2 flex flex-col  w-full gap-2">
                <Label>Account Role</Label>
                <Input
                  type="text"
                  value={userInfo.account.accountRole}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex grow bg-white shadow-xl  p-4 w-full">
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between  w-full">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <div className="text-slate-500 space-y-2">
                <Button onClick={() => setIsEdit(!isEdit)}>Edit Info</Button>
              </div>
            </div>

            {isEdit ? (
              <>
                <EditForm {...userInfo} />
              </>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-2xl">
                <h1>Name:</h1>
                <h1 className="col-span-2 ">
                  {userInfo.firstName +
                    " " +
                    userInfo.middleName +
                    " " +
                    userInfo.lastName}
                </h1>
                <h1>Position:</h1>
                <h1 className="col-span-2 ">{userInfo.assignedPosition}</h1>
                <h1>Division:</h1>
                <h1 className="col-span-2">{userInfo.assignedDivision}</h1>
                <h1>Section</h1>
                <h1 className="col-span-2">{userInfo.assignedSection}</h1>
                <h1>Date Started:</h1>
                <h1 className="col-span-2">
                  {new Date(userInfo.dateStarted).toDateString()}
                </h1>
                <h1>Job Status:</h1>
                <h1 className="col-span-2">{userInfo.jobStatus}</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // <div className="grid grid-rows-2 grid-cols-2  min-h-[calc(100vh-90px)] gap-4 bg-[#f4f4f4] px-12">
    //   <div className="row-span-2 grid grid-rows-2  rounded-xl bg-white px-8  relative">
    //     <ProfilePicture {...profileProps} />

    //

    //   <div className="h-full w-full bg-white rounded-xl flex flex-col">

    //   </div>
    //   <div className="flex flex-col gap-12 h-full bg-white rounded-xl p-4"></div>
    // </div>
  );
};
