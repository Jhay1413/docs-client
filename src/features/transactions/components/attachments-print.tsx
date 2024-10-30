import { tsr } from "@/services/tsr";
import { completeStaffWorkQuerySchema, filesQuerySchema } from "shared-contract";
import { z } from "zod";

export const AttachmentOnPrint = ({ attachments }: { attachments: z.infer<typeof completeStaffWorkQuerySchema>[] }) => {
  const mutateData = attachments.map((data) => {
    const id = data.id!;
    if (data.attachments.length === 0) return;
    const urls = data.attachments.map((data) => {
      return { url: data };
    });
    return { id, data: urls };
  });
  const filteredData = mutateData.filter((data) => data !== undefined);
  const { data, error, isError } = tsr.awsContract.getMultipleSignedUrl.useQuery({
    queryKey: ["attachments-signedUrl"],
    queryData: {
      query: {
        data: filteredData,
      },
    },
  });

  if (!data) return "Loading";
  console.log(error);
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col items-center justify-center ">
        {data.body.map((data, index) => (
          <div className="w-[80%] min-h-[200px] flex flex-col gap-8 mt-12" key={data.id}>
            <h1 className="font-bold text-lg">Annex {String.fromCharCode(65 + index)}</h1>
            {data.data && data.data.length > 0 ? (
              data.data.map((data) => {
                const extension = data.url.split(".").pop()!.toLowerCase();
                const validExtensions = ["jpg", "jpeg", "png"];
                return validExtensions.includes(extension) ? (
                  <img
                    key={data.signedUrl} // Ensure each img has a unique key
                    src={data.signedUrl}
                    alt="Description of the image"
                    className="object-contain"
                  />
                ) : (
                  <iframe
                    key={data.url}
                    src={data.signedUrl}
                    title="PDF Preview"
                    className="show-print"
                    style={{ width: "100%", height: "500px", border: "none" }}
                  />
                );
              })
            ) : (
              <h1>asdsad</h1>
            )}
            {/* {data.data.map((data) => (
              
              
            ))} */}
          </div>
        ))}
      </div>
    </div>
  );
};
