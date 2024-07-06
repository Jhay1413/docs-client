
import { useState } from "react";
import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "./transaction-form";
import { uploadMultipleFiles } from "@/services/uploadFile";
import { filesSchema, transactionFormData } from "../schema/TransactionSchema";
import { z } from "zod";
import { checkList } from "@/data/checklist";

type fileProps = {
  name: string;
  file: File;
};
export const InsertComponent = () => {
  const { add } = useTransaction("", "transaction", null);
  const { entities } = useCompanies("companies", "");

  const [files, setFiles] = useState<fileProps[]>([]);

  const onSubmit = async (
    transactionData: z.infer<typeof transactionFormData>
  ) => {
    // const formData = new FormData();
    // files.forEach((file, index) => {
    //   formData.append("files", file.file);
    //   formData.append(`fileNames[${index}]`, file.name);
    // });
    // const uploadFile = await uploadMultipleFiles(formData);
    // if (!uploadFile) {
    // }
    // const data= uploadFile.data.data as z.infer<typeof filesSchema>[];

    

    // const temp_section = checkList.find((check) => check.name === transactionData.team);
    // const attachmentList = temp_section?.application.find((check) => check.value === transactionData.documentType);
    // // const filePayload:z.infer<typeof filesSchema[]>= attachmentList?.checkList?.map((attachment)=>{
        
    // //     const matchAttachment = data.find(data=> data.fileName === attachment.name);


    // //     if(matchAttachment){
    // //         return matchAttachment
    // //     }
    // //     return {fileName:attachment.name}
    // // })
    
    // const payload = { ...transactionData, fileData: data };
    // console.log(payload);
    // add.mutate(payload);
    console.log(transactionData)
   
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm
        setFiles={setFiles}
        company={entities.data}
        mutateFn={onSubmit}
      />
    </div>
  );
};
