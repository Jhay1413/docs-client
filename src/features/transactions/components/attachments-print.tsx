import { Button } from "@/components/ui/button";
import { tsr } from "@/services/tsr";
import { completeStaffWorkQuerySchema, filesQuerySchema, getMultipleSignedUrlSchema } from "shared-contract";
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

  const { mutate, isPending, data } = tsr.awsContract.getMultipleSignedUrl.useMutation();

  const requestSignedUrls = () => {
    mutate({ body: filteredData });
  };
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col items-center justify-center ">
        <Button onClick={requestSignedUrls} disabled={data !== undefined || filteredData.length === 0}>
          Show Documents
        </Button>

        {data?.body.map((data, index) => (
          <div className="w-[90%] min-h-[200px] flex flex-col gap-8 mt-12 items-center justify-center " key={data.id}>
            <h1 className="font-bold text-lg">Annex {String.fromCharCode(65 + index)}</h1>
            <div className="w-full h-full flex flex-col gap-4 items-center justify-center ">
              {data.data && data.data.length > 0 ? (
                data.data.map((data) => {
                  const pattern = /\.png/;

                  return pattern.test(data.url) ? (
                    <div className="flex flex-col gap-4 items-center justify-center w-full h-full p-4 " key={data.signedUrl}>
                      <a href={data.signedUrl}>
                        <img src={data.signedUrl} alt="Description of the image" className="object-cover" />
                      </a>
                    </div>
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
                <h1>No Data</h1>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
