

import { z } from "zod";
import { filesSchema, signedUrlData, signedUrlDataArray, transactionFormData } from "../schema/TransactionSchema";
import { uploadFile } from "../services/uploadFile";

export const prepare_file_payload = async(
  
  attachments : z.infer<typeof filesSchema>[],
  data : z.infer<typeof signedUrlDataArray>
) => {
  const res = await Promise.all(
   data.map(async (data) => {
      const attachmentToUpload = attachments?.find((attachment) => attachment.fileName === data.fileName);

      if(!data.signedStatus)return data

      const response = await uploadFile(data.signedUrl!,attachmentToUpload?.file![0]!);

      if(!response?.ok) return {...data,uploadStatus:false};
      
      return {...data,uploadStatus:true,fileOrignalName : attachmentToUpload?.file![0]!.name}
    })
  );
  return res;
};

export const prepare_transaction_payload = (
  transactionData: z.infer<typeof transactionFormData>,
  res: z.infer<typeof signedUrlData>[]
) => {
  const modified_fileData = transactionData.attachments?.map(attachment=>{
    const matchedFile = res.find(file => file.uploadStatus && (file.fileName === attachment.fileName));

    const {file , ...new_fileData} = attachment

    if(matchedFile){
      console.log(matchedFile);
      return {...new_fileData,fileUrl:matchedFile.key,fileOriginalName:matchedFile.fileOriginalName}
    } 
    return new_fileData
  })
  const payload = {...transactionData, attachments:modified_fileData}
  console.log
  return payload;
};
