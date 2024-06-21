import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Header } from "@/layout/Header";
import { SideNav } from "@/layout/Sidenav";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
   

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-[#f4f4f4]">
    <div className="flex flex-none w-full min-h-[77px] bg-white z-10">
      <Header />
    </div>

    <div className="grow flex max-h-full   ">
      <div className="flex-none w-[250px] bg-white ">
        <SideNav />
      </div>
      <div className="grow overflow-auto flex items-center justify-center px-2 ">
        <ScrollArea className="h-[calc(100vh-90px)] bg-white w-full rounded-sm p-8">
            <Outlet/>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  </div>
  );
};
