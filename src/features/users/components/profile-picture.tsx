import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import { toast } from "react-toastify";
import { useUserMutation } from "../hooks/mutation";

type Props = {
  signedUrl: string;
  id: string;
};
export const ProfilePicture = ({ signedUrl, id }: Props) => {
  const [previewImg, setPreviewImg] = useState("");
  const [img, setImg] = useState<File>();
  const { useUpdateProfileMutation } = useUserMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPreviewImg(URL.createObjectURL(event.target.files[0]));
      setImg(event.target.files[0]);
    }
  };
  const onError = (data: any) => {
    console.log(data);
    toast.error("Something went wrong while updating the profile !");
  };
  const onSuccess = () => {
    toast.success("Profile updated ! ");
    setPreviewImg("");
    setImg(undefined);
  };
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  const submit = async () => {
    const formData = new FormData();

    if (img) {
      formData.append("img", img);
      useUpdateProfileMutation.mutate(
        { id, formData },
        {
          onError: (data) => onError(data),
          onSuccess: () => onSuccess(),
        }
      );
    }
  };
  return (
    <div className="w-full flex justify-center">
      <div className="right-2 absolute top-2">
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => fileChange(e)}
        />
        {img ? (
          <div className="flex justify-start gap-2">
            <Button variant="default" onClick={() => submit()}>
              Save
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setPreviewImg("");
                setImg(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={handleFileUpload}
            className="bg-green-500 p-2 rounded-lg text-sm hover:bg-green-200"
          >
            <div className="flex text-white items-center justify-center gap-2">
              <Upload />
              <h1>Upload</h1>
            </div>
          </button>
        )}
      </div>
      <Avatar className="w-[300px] h-[300px]">
        <AvatarImage src={previewImg || signedUrl} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};
