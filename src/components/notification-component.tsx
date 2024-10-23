import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Dot } from "lucide-react";
import { tsr } from "@/services/tsr";
import { getCurrentUserId } from "@/hooks/hooks/use-user-hook";

export const NotificationComponent = () => {
  const id: string = getCurrentUserId();
  const { data } = tsr.notificationContract.getNotificationsByUserId.useQuery({
    queryKey: ["notifications", id],
    queryData: {
      query: {
        id: id,
      },
    },
  });
  return (
    <div className="absolute h-[500px] w-full top-full rounded-lg z-10 bg-white">
      <div className="p-4">Notifications</div>
      <ScrollArea className="flex w-full h-full flex-col gap-4 bg-white rounded-lg pb-2 pr-2 pl-2">
        {data?.body && data?.body.length > 0 ? (
          data.body.map((data) => (
            <div key={data.id} className={`flex items-center py-4 px-2 border-b-2 border-black/10 ${!data.isRead && "bg-gray-100"}`}>
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" className="w-[45px] h-[45px] rounded-full object-cover" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-1 w-full overflow-hidden">
                  <Link to={`/dashboard/transactions/history/${data.transactionId}?notifId=${data.id}`} className="flex flex-col gap-2">
                    <h1 className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{data.message}</h1>
                    <h1 className="text-muted-foreground text-sm">{new Date(data.createdAt).toDateString()}</h1>
                  </Link>
                </div>
              </div>
              {!data.isRead && (
                <div className="flex items-center justify-end mr-2">
                  <Dot className="text-green-500" size={32} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center">No notifications</div>
        )}
      </ScrollArea>
    </div>
  );
};
