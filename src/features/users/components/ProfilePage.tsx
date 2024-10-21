import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditForm, TUserWithAccount } from "@/features/users";
import { ProfilePicture } from "./profile-picture";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ban, Pencil } from "lucide-react";

export const ProfilePage = (userInfo: TUserWithAccount) => {
  const profileProps = {
    signedUrl: userInfo.signedUrl,
    id: userInfo.id,
  };

  return (
    <div className="flex w-full h-full bg-white gap-4 p-24 ">
      <div className="grid grid-cols-2 w-full gap-4 grid-rows-2 h-full">
        <div className="row-span-2 border h-full flex">
          <div className="w-full relative flex flex-col mt-16 ">
            <ProfilePicture {...profileProps} />

            <div className="flex flex-col gap-2 items-center w-full justify-center mt-16">
              <h1 className="text-xl">{userInfo.firstName + " " + userInfo.middleName + " " + userInfo.lastName}</h1>
              <h1 className="text-sm">{userInfo.assignedPosition}</h1>
              <h1 className="text-sm">{userInfo.assignedDivision}</h1>
            </div>
            <div className="h-full flex  items-center justify-center ">
              <img src="/logover1.png" className="w-[300px] h-[185px]  " />
            </div>
          </div>
        </div>
        <div className="flex-none h-full w-full border relative">
          <div className="flex flex-col gap-4 items-center justify-center absolute    w-full h-full z-5">
            <Ban size={48} className="text-red-500" />
            <h1>You are not authorized</h1>
            <h1 className="text-muted-foreground">It seems like you don't have permission to view this section . </h1>
            <h1 className="text-muted-foreground">Please sign-in an admin account. </h1>
          </div>
          <div className="w-full h-full opacity-10">
            <div className="p-4 flex">
              <h1 className="text-xl font-bold">Account settings</h1>
            </div>
            <div className="relative">
              <Button className="absolute right-4 bottom-1 ">Change Password</Button>
            </div>
            <div className="flex grow w-full ">
              <div className="p-4 grid grid-rows-3 grid-cols-3  w-full m-4 gap-4">
                <div className="col-span-2 flex flex-col w-full gap-2 ">
                  <Label>Email</Label>
                  <Input value={userInfo.account.email} readOnly />
                </div>

                <div className="col-span-2 flex flex-col  w-full gap-2 ">
                  <Label>Password</Label>
                  <Input type="password" value={userInfo.account.password} readOnly />
                </div>
                <div className="col-span-2 flex flex-col  w-full gap-2">
                  <Label>Account Role</Label>
                  <Input type="text" value={userInfo.account.accountRole} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full  p-8 border flex flex-col gap-2">
          <div className="">
            <h1>My Profile</h1>
          </div>
          <div className="grid grid-cols-2 gap-8 p-4">
            <div className="flex flex-col gap-4 w-full h-full border-r-2 border-r-green-500">
              <div className="flex flex-col gap-2 ">
                <h1 className="text-xs text-muted-foreground">Name:</h1>
                <h1 className="text-sm">
                  {userInfo.firstName} {userInfo.lastName}
                </h1>
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="text-xs text-muted-foreground">Position:</h1>
                <h1 className="text-sm">{userInfo.assignedPosition}</h1>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full h-full px-8">
              <div className="flex flex-col gap-2 ">
                <h1 className="text-xs text-muted-foreground">Divisions:</h1>
                <h1 className="text-sm">{userInfo.assignedDivision}</h1>
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="text-xs text-muted-foreground">Section:</h1>
                <h1 className="text-sm">{userInfo.assignedSection}</h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 ">
              <h1 className="text-xs text-muted-foreground">Job Status:</h1>
              <h1 className="text-sm">{userInfo.jobStatus}</h1>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="text-xs text-muted-foreground">Birthdate:</h1>
              <h1 className="text-sm">{new Date(userInfo.birthDate).toDateString()}</h1>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="text-xs text-muted-foreground">Date started:</h1>
              <h1 className="text-sm">{new Date(userInfo.dateStarted).toDateString()}</h1>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="text-xs text-muted-foreground">Company email:</h1>
              <h1 className="text-sm">{userInfo.email}</h1>
            </div>
            <div className="flex flex-col gap-2 ">
              <h1 className="text-xs text-muted-foreground">Contact number:</h1>
              <h1 className="text-sm">{userInfo.contactNumber}</h1>
            </div>
          </div>
          <div className="w-full h-full col-span-2 flex justify-end">
            <Button className="bg-green-500 flex justify-start gap-2 p-2">
              Edit information <Pencil size={18} />{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>

    // <div className="flex grow flex-col gap-4">
    // <div className="flex grow bg-white shadow-xl  p-4 w-full">
    //   <div className="flex flex-col gap-8 w-full">
    //     <div className="flex justify-between  w-full">
    //       <h1 className="text-2xl font-bold">My Profile</h1>
    //       {/* <div className="text-slate-500 space-y-2">
    //       <Button onClick={() => setIsEdit(!isEdit)}>Edit Info</Button>
    //     </div> */}
    //     </div>

    //     <>
    //       <EditForm {...userInfo} />
    //     </>
    //   </div>
    // </div>
    // </div>
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
