import { useParams } from "react-router-dom";
// Adjust the import based on your project structure
import { useQuery } from "react-query"; // Assuming you're using react-query for data fetching
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table"; // Assuming you have a DataTable component for displaying logs
import { tsr } from "@/services/tsr";
import { ticketsDetailsColumn } from "./tickets-details-column";


export const TicketDetails = () => {
  const { id } = useParams(); // Get the ticket ID from the URL parameters

  // Fetch ticket details using the ticket ID
  const { data, isLoading, isError } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: {
      params: { id: id! },
    },
  });

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error fetching ticket details.</div>;
  }


  console.log(data?.body);
  return (
    <div className="flex flex-col w-full p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Ticket Details</h1>
      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">Ticket ID:</h2>
          <p>{data?.body.ticketId ? data.body.ticketId : "No Ticket ID"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Subject:</h2>
          <p>{data?.body.subject ? data.body.subject : "No Subject"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Section:</h2>
          <p>{data?.body.section ? data.body.section : "No Section"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Division:</h2>
          <p>{data?.body.division ? data.body.division : "No Division"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Status:</h2>
          <p>{data?.body.status ? data.body.division : "No Division"}</p>
        </div>
        {/* <div>
          <h2 className="font-semibold">Request Type:</h2>
          <p>{data?.body.requestType ? data.body.requestType : "No Request Type"}</p>
        </div> */}
        <div>
          <h2 className="font-semibold">Request Details:</h2>
          <p>{data?.body.requestDetails ? data.body.requestDetails : "No Request Details"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Priority:</h2>
          <p>{data?.body.priority ? data.body.priority : "No Priority"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Due Date:</h2>
          <p>{new Date(data?.body.dueDate!).toLocaleDateString()}</p>
        </div>
        <div>
          <h2 className="font-semibold">Date Forwarded:</h2>
          <p>{new Date(data?.body.dateForwarded!).toLocaleDateString()}</p>
        </div>
        <div>
          <h2 className="font-semibold">Date Received:</h2>
          <p>{data?.body.dateReceived ? new Date(data?.body.dateReceived).toLocaleDateString() : "Not received yet"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Sender:</h2>
          <p>{data?.body.sender.userInfo?.firstName || data?.body.sender.userInfo?.lastName
                ? `${data.body.sender.userInfo.firstName || ''} ${data.body.sender.userInfo.lastName || ''}` 
                : "No Name"}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Receiver:</h2>
          <p>{data?.body.receiver.userInfo?.firstName || data?.body.receiver.userInfo?.lastName
                ? `${data.body.receiver.userInfo.firstName || ''} ${data.body.receiver.userInfo.lastName || ''}` 
                : "No Name"}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Requestee:</h2>
          <p>
            {data?.body.requestee.userInfo?.firstName || data?.body.requestee.userInfo?.lastName 
                ? `${data.body.requestee.userInfo.firstName || ''} ${data.body.requestee.userInfo.lastName || ''}` 
                : "No Name"}
          </p>

        </div>
        <div>
          <h2 className="font-semibold">Remarks:</h2>
          <p>{data?.body.remarks ? data.body.remarks : "No Remarks"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Project:</h2>
          <p>{data?.body.project ? data?.body.project.projectName : "Not assigned to a project"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Transaction ID:</h2>
          <p>{data?.body.transactionId ? data.body.transactionId : "No transaction"}</p>
        </div>
        {/* <div>
          <h2 className="font-semibold">Attachments:</h2>
          <p>{attachments}</p>
        </div> */}
      </div>

      <Separator className="my-4" />

      <h2 className="text-lg font-bold">Ticket Logs:</h2>
      
      <DataTable columns={ticketsDetailsColumn} data={data ? data.body.ticketLogs : []} hasPaginate={true} />
    </div>
  );
};

export default TicketDetails;