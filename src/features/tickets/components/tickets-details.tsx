import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { tsr } from "@/services/tsr";
import { ticketsDetailsColumn } from "./tickets-details-column";
import { getSignUrlForView } from "@/features/transactions/services/getSignedUrl";
import { Button } from "@/components/ui/button";

export const TicketDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: {
      params: { id: id! },
    },
  });

  const viewFile = async (key: string) => {
    const signedUrl = await getSignUrlForView(key);
    if (signedUrl) {
      window.open(signedUrl);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold text-red-500">Error fetching ticket details.</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-[90%] mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Ticket ID:</h2>
          <p className="text-gray-600">{data?.body.ticketId ? data.body.ticketId : "No Ticket ID"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Subject:</h2>
          <p className="text-gray-600">{data?.body.subject ? data.body.subject : "No Subject"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Section:</h2>
          <p className="text-gray-600">{data?.body.section ? data.body.section : "No Section"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Division:</h2>
          <p className="text-gray-600">{data?.body.division ? data.body.division : "No Division"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Status:</h2>
          <p className="text-gray-600">{data?.body.status ? data.body.status : "No Status"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Request Details:</h2>
          <p className="text-gray-600">{data?.body.requestDetails ? data.body.requestDetails : "No Request Details"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Priority:</h2>
          <p className="text-gray-600">{data?.body.priority ? data.body.priority : "No Priority"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Due Date:</h2>
          <p className="text-gray-600">{new Date(data?.body.dueDate!).toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Date Forwarded:</h2>
          <p className="text-gray-600">{new Date(data?.body.dateForwarded!).toLocaleDateString()}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Date Received:</h2>
          <p className="text-gray -600">{data?.body.dateReceived ? new Date(data?.body.dateReceived).toLocaleDateString() : "Not received yet"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Sender:</h2>
          <p className="text-gray-600">{data?.body.sender.userInfo?.firstName || data?.body.sender.userInfo?.lastName
                ? `${data.body.sender.userInfo.firstName || ''} ${data.body.sender.userInfo.lastName || ''}` 
                : "No Name"}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Receiver:</h2>
          <p className="text-gray-600">{data?.body.receiver.userInfo?.firstName || data?.body.receiver.userInfo?.lastName
                ? `${data.body.receiver.userInfo.firstName || ''} ${data.body.receiver.userInfo.lastName || ''}` 
                : "No Name"}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Requestee:</h2>
          <p className="text-gray-600">{data?.body.requestee.userInfo?.firstName || data?.body.requestee.userInfo?.lastName 
                ? `${data.body.requestee.userInfo.firstName || ''} ${data.body.requestee.userInfo.lastName || ''}` 
                : "No Name"}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Remarks:</h2>
          <p className="text-gray-600">{data?.body.remarks ? data.body.remarks : "No Remarks"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Project:</h2>
          <p className="text-gray-600">{data?.body.project ? data?.body.project.projectName : "Not assigned to a project"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Transaction ID:</h2>
          <p className="text-gray-600">{data?.body.transactionId ? data.body.transactionId : "No transaction"}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Attachments:</h2>
          <p className="text-gray-600">{data?.body.attachments ? (
            <a className="text-blue-500 hover:text-primary " href="#" onClick={() => viewFile(data?.body.attachments!)}>
            View file
          </a>
          ) 
          
          : "No Attachments" }</p>
        </div>
      </div>

      <Separator className="my-4" />

      <h2 className="text-lg font-bold text-gray-800">Ticket Logs:</h2>

      <DataTable columns={ticketsDetailsColumn} data={data ? data.body.ticketLogs : []} hasPaginate={true} />
    </div>
  );
};

export default TicketDetails;