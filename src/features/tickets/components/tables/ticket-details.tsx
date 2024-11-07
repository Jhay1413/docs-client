import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { tsr } from "@/services/tsr";
import { ticketsDetailsColumn } from "./ticket-details-column";
import { getSignUrlForView } from "@/features/transactions/services/getSignedUrl";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import ConfirmationModal from "@/components/confirmation-modal";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";


const ForwardTicketBtn = ({id}: {id?:string}) => (
  <div>
    <Link
      to={`/dashboard/tickets/forward-ticket/${id}`}
      className="bg-[#414140] px-4 py-2 text-lg flex items-center justify-center space-x rounded-lg text-white"
    >
      <Plus size={24} />
      <h1>Forward Ticket</h1>
    </Link>
  </div>
);

const ReopenTicketBtn = () => (
    <Button type="button" className="bg-[#414140] px-4 py-2 text-lg flex items-center justify-center space-x rounded-lg text-white">Reopen Ticket</Button>
);


export const TicketDetails = () => {
  const { id } = useParams();
  const currentUserId = getCurrentUserId();
  const [open, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: {
      params: { id: id! },
    },
  });
  const { mutate } = tsr.ticketing.resolveTickets.useMutation({
    onMutate: () => { },
    onSuccess: () => {
      toast.success("Ticket resolved !");
      navigate(`/dashboard/tickets/inbox/${currentUserId}`);
    },
    onError: (error) => {
      console.error("Error forwarding ticket:", error);
      toast.error("Failed to forward ticket. Please try again.");
    },
  });
  console.log("ticket data:", data);



  const handleConfirm = () => {
    mutate({body:{
      userId:currentUserId
    },params:{
      id:id!
    }})
  }

  const handleCancel = () => {
    console.log("Cancelled!")
  }

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Ticket Details</h1>
        <div className="flex justify-start items-center gap-4">
          
          {data?.body.requestee?.id === currentUserId && data?.body.status != 'RESOLVED' &&
            <ConfirmationModal
              title="Are you sure?"
              description="This action cannot be undone."
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              triggerButton="Resolve"
            />
          }

          {data?.body.status === 'RESOLVED' && <ReopenTicketBtn />}
          {data?.body.receiver?.id === currentUserId && data?.body.status != 'RESOLVED' && <ForwardTicketBtn id={id}/>}

        </div>
      </div>
      <Separator className="my-4" />
      {/* Ticket Subject Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-4 items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 col-span-2 gap-6 mb-4 shadow rounded-lg h-full">
          <div className="bg-white p-4 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Ticket ID:</h2>
            <p className="text-gray-600">{data?.body.ticketId || "No Ticket ID"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Subject:</h2>
            <p className="text-gray-600">{data?.body.subject || "No Subject"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Section:</h2>
            <p className="text-gray-600">{data?.body.section || "No Section"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Division:</h2>
            <p className="text-gray-600">{data?.body.division || "No Division"}</p>
          </div>
        </div>
        {/* Ticket Importance Data */}
        <div className="grid grid-cols-1 gap-6 col-span-1 shadow rounded-lg h-full">
          <div className="bg-white p-4 pb-0 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Status:</h2>
            <p className="text-gray-600">{data?.body.status || "No Status"}</p>
          </div>
          <div className="bg-white p-4 pt-0 pb-0 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Priority:</h2>
            <p className="text-gray-600">{data?.body.priority || "No Priority"}</p>
          </div>
          <div className="bg-white p-4 pt-0 rounded-lg h-full">
            <h2 className="font-semibold text-gray-700">Due Date:</h2>
            <p className="text-gray-600">{new Date(data?.body.dueDate!).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />
      {/* Ticket Sender/Receiver Data */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-4 shadow rounded-lg">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700">Date Forwarded:</h2>
          <p className="text-gray-600">{new Date(data?.body.dateForwarded!).toLocaleDateString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700">Date Received:</h2>
          <p className="text-gray -600">{data?.body.dateReceived ? new Date(data?.body.dateReceived).toLocaleDateString() : "Not received yet"}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700">Requestee:</h2>
          <p className="text-gray-600">
            {data?.body.requestee.userInfo?.firstName || data?.body.requestee.userInfo?.lastName
              ? `${data.body.requestee.userInfo.firstName || ""} ${data.body.requestee.userInfo.lastName || ""}`
              : "No Name"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700">Sender:</h2>
          <p className="text-gray-600">
            {data?.body.sender.userInfo?.firstName || data?.body.sender.userInfo?.lastName
              ? `${data.body.sender.userInfo.firstName || ""} ${data.body.sender.userInfo.lastName || ""}`
              : "No Name"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700">Receiver:</h2>
          <p className="text-gray-600">
            {data?.body.receiver?.userInfo?.firstName || data?.body.receiver?.userInfo?.lastName
              ? `${data.body.receiver.userInfo.firstName || ""} ${data.body.receiver.userInfo.lastName || ""}`
              : "No Name"}
          </p>
        </div>
      </div>

      <Separator className="my-4" />
      {/* Request Details and Remarks */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow text-lg">
          <h2 className="font-semibold text-gray-700">Request Details:</h2>
          <p className="text-gray-600">{data?.body.requestDetails || "No Request Details"}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-lg">
          <h2 className="font-semibold text-gray-700">Remarks:</h2>
          <p className="text-gray-600">{data?.body.remarks || "No Remarks"}</p>
        </div>
      </div>

      {/* Conditionally render Project Details */}
      {data?.body.project && (
        <>
          <Separator className="my-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-4">Project Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-4 shadow rounded-lg items-stretch">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 col-span-2 gap-6 mb-4 shadow rounded-lg h-full">
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Project ID:</h2>
                <p className="text-gray-600">{data.body.project.projectId || "No Project"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Project Name:</h2>
                <p className="text-gray-600">{data.body.project.projectName || "No Project"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Project Address:</h2>
                <p className="text-gray-600">{data.body.project.projectAddress || "No Project"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Contact Person:</h2>
                <p className="text-gray-600">{data.body.project.contactPersons?.name || "No Contact Details"}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conditionally render Transaction ID */}
      {data?.body.transactionId && (
        <>
          <Separator className="my-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-4">Transaction Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-4 shadow rounded-lg items-stretch">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 col-span-2 gap-6 mb-4 shadow rounded-lg h-full">
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Transaction ID:</h2>
                <p className="text-gray-600">{data.body.transaction?.transactionId}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Document Subtype:</h2>
                <p className="text-gray-600">{data.body.transaction?.documentSubType}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Priority:</h2>
                <p className="text-gray-600">{data.body.transaction?.priority}</p>
              </div>
              <div className="bg-white p-4 rounded-lg h-full">
                <h2 className="font-semibold text-gray-700">Due Date:</h2>
                <p className="text-gray-600">{new Date(data.body.transaction?.dueDate!).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conditionally render Attachments */}
      {data?.body.attachments.length! > 0 && (
        <>
          <Separator className="my-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-4">Attachments</h1>
         
            <ScrollArea className="h-40">
            {data?.body.attachments.map((attachment, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2">
                    <FileText className="text-gray-600" />
                    <p className="text-gray-700 truncate">{attachment}</p>
                  </div>
                  <button className="ml-4 px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
                    View
                  </button>
                </div>
            ))}
            </ScrollArea>
         
        </>
      )}

      <Separator className="my-4" />
      <h2 className="text-lg font-bold text-gray-800">Ticket Logs:</h2>
      <DataTable columns={ticketsDetailsColumn} data={data ? data.body.ticketLogs : []} hasPaginate={true} />
    </div>
  );
};

export default TicketDetails;
