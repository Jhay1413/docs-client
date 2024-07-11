import { z } from "zod";
import { filesSchema, transactionFormData } from "../schema/TransactionSchema";

export const prepare_file_payload = (
  transactionData: z.infer<typeof transactionFormData>
) => {
  const attachments = transactionData.attachments?.filter(
    (data) => data.file?.length! > 0
  );
  const formData = new FormData();

  attachments?.forEach((file, index) => {
    if (file.file && file.file?.length > 0) {
      formData.append("files", file?.file[0]);
      formData.append(`fileNames[${index}]`, file.fileName!);
    }
  });

  return formData;
};

export const prepare_transaction_payload = (
  transactionData: z.infer<typeof transactionFormData>,
  data: z.infer<typeof filesSchema>[]
) => {
  const modified_fileData = transactionData?.attachments?.map((attachement) => {
    const matchedFile = data.find(
      (file_data) => file_data.fileName === attachement.fileName
    );

    const { file, ...new_fileData } = attachement;
    if (matchedFile) {
      return { ...new_fileData, fileUrl: matchedFile.fileUrl };
    }
    return new_fileData;
  });

  const payload = { ...transactionData, attachments: modified_fileData };

  return payload;
};
