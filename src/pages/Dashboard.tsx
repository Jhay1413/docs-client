import MyCalendar from "@/components/calendar";
import { PriorityBarChart } from "@/components/priority-bar-chart";
import { PriorityChart } from "@/components/priority-chart";
import { Component } from "@/components/total-project-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarFormDialog, DashboardDataSchema, PerSection } from "@/features/dashboard";
import ConferenceCalendar from "@/features/dashboard/components/conference-calender";
import { PerApplication, PrioritySchema, TotalProject } from "@/features/dashboard/schema/dashboardSchema";
import { useTransactions } from "@/features/transactions/hooks/query-gate";
import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { useCurrentUserFirstName } from "@/hooks/use-user-hook";
import { Dot, Ellipsis, Search } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";



export const Dashboard = () => {
  const { entities } = useTransactions(
    "dashboardData",
    "v2/dashboardData"
  );
 

  const currentUser = useCurrentUserFirstName();
  
  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 13),
    }),
    []
  );
  if(entities.isLoading) return "loading";

  const validateSchema = DashboardDataSchema.safeParse(entities.data);
  if(!validateSchema.success || !validateSchema.data) {
    console.log(validateSchema.error);

    return
  }

  //Need to review this code
  const priority = validateSchema.data?.find(data=>data.category == "Priority") as z.infer<typeof PrioritySchema>;;
  const perApplication = validateSchema.data.find(data=>data.category== "Per Application") as z.infer<typeof PerApplication>;;

  const total = validateSchema.data.find(data=> data.category == "Total Projects") as z.infer<typeof TotalProject>;;
  const perSection = validateSchema.data.find(data=> data.category == "Per Section") as z.infer<typeof PerSection>;
  const totalEIA = perSection.data.find(data => data.categoryName === "EIA");
  const totalTCTI = perSection.data.find(data => data.categoryName === "TCTI");
  const totalEPD = perSection.data.find(data => data.categoryName === "EPD");
  const totalICS = perSection.data.find(data => data.categoryName === "ICS");
  return (
    <div className="flex w-full flex-col gap-12">
      <h1 className="text-[28px] font-semibold bg-gradient-to-r from-[#547326] to-[#93CB41] bg-clip-text text-transparent">
        Welcome back, {currentUser}!
      </h1>

      <div className="grid grid-cols-5 grid-rows-2 w-full  gap-4">
        <div className="col-span-5 xl:col-span-3 xl:row-span-2 rounded-md  relative ">
          <ConferenceCalendar />
        </div>

        <div className="col-span-5 lg:xl:col-span-2 w-full  row-span-2 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4  h-[400px] ">
            <h1 className="text-lg">Recent Activity</h1>
            <div className="grow flex flex-col bg-white rounded-md  px-2 py-4 overflow-auto ">
              <div className="flex justify-end p-4">
                <Ellipsis />
              </div>
              <ScrollArea className="h-full ">
                <div className="flex flex-col px-2 gap-8 justify-center h-full text-xs">
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="text-muted-foreground">5 hours ago</h1>
                      <h1 className="text-muted-foreground">
                        <span className="font-bold">Jhon Christian</span>{" "}
                        Forwarded a transaction
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="text-muted-foreground">5 hours ago</h1>
                      <h1 className="text-muted-foreground">
                        <span className="font-bold">Jhon Christian</span>{" "}
                        Forwarded a transaction
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="text-muted-foreground">5 hours ago</h1>
                      <h1 className="text-muted-foreground">
                        <span className="font-bold">Jhon Christian</span>{" "}
                        Forwarded a transaction
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="text-muted-foreground">5 hours ago</h1>
                      <h1 className="text-muted-foreground">
                        <span className="font-bold">Jhon Christian</span>{" "}
                        Forwarded a transaction
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="text-muted-foreground">5 hours ago</h1>
                      <h1 className="text-muted-foreground">
                        <span className="font-bold">Jhon Christian</span>{" "}
                        Forwarded a transaction
                      </h1>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-col gap-4  h-[400px]">
            <h1 className="text-lg">Online Users</h1>
            <div className="flex flex-col bg-white rounded-md h-full  px-4 py-4 overflow-auto">
              <div className="flex items-center justify-center px-4 py-4">
                <Input placeholder="Search ...." />
                <div className="p-2 bg-green-500 rounded-r-md text-white">
                  <Search className="" />
                </div>
              </div>
              <ScrollArea className=" h-full overflow-auto">
              <div className="flex flex-col gap-4 justify-center h-full text-xs">
                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center ">
                    <Dot size={40} className="text-primaryColor " />
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="w-[45px] h-[45px] rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h1 className="font-bold">Jhon Christian Ubaldo</h1>
                      <h1 className="text-muted-foreground">IT</h1>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-col  gap-4 row-span-1">
            <h1 className="text-lg">Applications</h1>
            <div className="grid grid-cols-2 h-full grid-rows-2 gap-4 ">
              <div className="flex flex-col bg-white row-span-1  rounded-md ">
                <div className="flex justify-start items-center gap-2 p-1">
                  <div className="bg-blue-400/50 p-2 rounded-md text-white">
                    <Search size={20} />
                  </div>
                  <h1 className="text-sm">Total Applications</h1>
                </div>
                <div className="flex flex-col items-center justify-center  h-full">
                  <h1 className="font-bold text-4xl">{totalICS?.count || 0}</h1>
                  <h1>
                    <span className="text-blue-400 font-bold">ICS</span> Section
                  </h1>
                </div>
              </div>
              <div className="flex flex-col bg-white w-full row-span-1 col-span-1 rounded-md ">
                <div className="flex justify-start items-center gap-2 p-1">
                  <div className="bg-primaryColor p-2 rounded-md text-white">
                  <Search size={20} />
                  </div>
                  <h1 className="text-sm">Total Applications</h1>
                </div>
                <div className="flex flex-col items-center justify-center  h-full">
                  <h1 className="font-bold text-4xl">{totalEIA?.count || 0}</h1>
                  <h1>
                    <span className="text-primaryColor font-bold">EIA</span>{" "}
                    Section
                  </h1>
                </div>
              </div>
              <div className="flex flex-col bg-white w-full row-span-1 col-span-1 rounded-md ">
                <div className="flex justify-start items-center gap-2 p-1">
                  <div className="bg-red-500/50 p-2 rounded-md text-white">
                    <Search size={20} />
                  </div>
                  <h1 className="text-sm">Total Applications</h1>
                </div>
                <div className="flex flex-col items-center justify-center  h-full">
                <h1 className="font-bold text-4xl">{totalEPD?.count || 0}</h1>
                  <h1>
                    <span className="text-red-500 font-bold">EPD</span> Section
                  </h1>
                </div>
              </div>
              <div className="flex flex-col bg-white w-full row-span-1 col-span-1 rounded-md ">
                <div className="flex justify-start items-center gap-2 p-1">
                  <div className="bg-yellow-500/50 p-2 rounded-md text-white">
                    <Search size={20} />
                  </div>
                  <h1 className="text-sm">Total Applications</h1>
                </div>
                <div className="flex flex-col items-center justify-center  h-full">
                <h1 className="font-bold text-4xl">{totalTCTI?.count || 0}</h1>
                  <h1>
                    <span className="text-yellow-500 font-bold">TCTI</span>{" "}
                    Section
                  </h1>
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col gap-4 row-span-1">
          <h1 className="text-lg">Charts</h1>
          <div className="h-full relative">
            <Component data = {total?.data}/>
          </div>
        </div>
          
        </div>

        {/* </div> */}
      </div>
      <div className="grid grid-cols-2 w-full  min-h-[800px] xl:min-h-[500px]  gap-4">
        <div className="relative w-full h-full col-span-2 xl:col-span-1 ">
          <PriorityChart data={priority} />
        </div>
        <div className="relative w-full h-full col-span-2 xl:col-span-1 ">
          <PriorityBarChart data = {perApplication}/>
        </div>
      </div>
      <CalendarFormDialog/>
    </div>
  );
};
