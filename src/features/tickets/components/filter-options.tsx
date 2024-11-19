import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { tsr } from "@/services/tsr";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { SetURLSearchParams } from "react-router-dom";

interface FilterOptionsProps {
  setSearchParams: SetURLSearchParams;
  refetch: () => void;
  isSubmitting:boolean
 
}

export function FilterOptions({ setSearchParams, refetch,isSubmitting }: FilterOptionsProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchTransaction, setSearchTransaction] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [debouncedSearchTransaction] = useDebounce(searchTransaction, 500);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const userId = getCurrentUserId();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const role = useCurrentUserRole();

  const [selectectedType, setSelectedType] = useState("");
  const [selectedSender, setSelectedSender] = useState("");

  const priorityOptions = ["Urgent", "Important", "Low"];
  const statusOptions = ["ROUTING", "ON_PROCESS", "ON_GOING", "COMPLETED", "APPROVED", "FOR SIGN AND SEAL"];

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Fetching projects using React Query
  const { data: projects } = tsr.company.fetchCompanyProjectsBySearch.useQuery({
    queryKey: ["projects", debouncedSearchQuery],
    queryData: {
      query: {
        projectName: debouncedSearchQuery,
      },
    },
    placeholderData: keepPreviousData,
  });
  
  const clearSearchParams = () => {
    setSearchParams({
      projectId: "",
      transactionId: "",
      priority: "",
      status: "",
      sender: "",
    });
    setSelectedProject("");
    setSelectedTransaction("");
    setSelectedPriority("");
    setSelectedStatus("");
    setSelectedSection("");
    setSelectedSender("");
    setTimeout(() => {
      submitButtonRef.current?.click();
    }, 200);
    console.log(submitButtonRef.current);
  }

  console.log(isSubmitting);
  // Fetching transactions using React Query
  const { data: transactions } = tsr.transaction.searchTransactionById.useQuery({
    queryKey: ["transactions-query", debouncedSearchTransaction],
    queryData: {
      query: {
        transactionId: debouncedSearchTransaction,
      },
    },
    placeholderData: keepPreviousData,
  });

  const { data: users } = tsr.userAccounts.getUsersForTickets.useQuery({
    queryKey: ["usersForTicket", selectedDivision, selectedSection, selectectedType],
    queryData: {
      query: {
        division: selectedDivision,
        section: selectedSection,
        role: role,
        mode: "insert",
      },
    },
  });
  const selectedProjectObject = projects?.body.find(data=>data.id === selectedProject)
  const selectedSenderObject = users?.body.find(data=>data.id === selectedSender)
  // Handlers

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-between items-start ">
          <Button variant="outline">
            <SlidersHorizontal className="mr-2"/>
            Filter
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <div className="pb-4">
          {/* Project Search */}
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className={cn("justify-between w-full", !selectedProject && "text-muted-foreground")}>
                {selectedProjectObject?.projectName || "Search Project..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search Project..." onValueChange={(e) => setSearchQuery(e)} />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects?.body?.map((data) => (
                      <CommandItem value={data.id} key={data.id} onSelect={() => {
                        
                        setSelectedProject(data.id)
                        setSearchParams(
                          (prev) => {
                            prev.set("projectId", data.id);
                            prev.set("currentPage", "1");
                            return prev;
                          },
                          { replace: true },
                        )
                        }}>
                        <Check className={cn("mr-2 h-4 w-4", data.projectName === selectedProject ? "opacity-100" : "opacity-0")} />
                        {data.projectName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <DropdownMenuSeparator />
          {/* Transaction Search */}
          <DropdownMenuLabel>Transaction</DropdownMenuLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className={cn("justify-between w-full", !selectedTransaction && "text-muted-foreground")}>
                {selectedTransaction || "Search Transaction..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search Transaction..." onValueChange={(e) => setSearchTransaction(e)} />
                <CommandList>
                  <CommandEmpty>No transaction found.</CommandEmpty>
                  <CommandGroup>
                    {transactions?.body?.map((data) => (
                      <CommandItem
                        value={data.transactionId}
                        key={data.id}
                        onSelect={() =>{
                          setSelectedTransaction(data.transactionId)
                          setSearchParams(
                            (prev) => {
                              prev.set("transactionId", data.transactionId);
                              prev.set("currentPage", "1");
                              return prev;
                            },
                            { replace: true },
                          )
                        }
                      }
                      >
                        <Check className={cn("mr-2 h-4 w-4", data.transactionId === selectedTransaction ? "opacity-100" : "opacity-0")} />
                        {`${data.transactionId} - ${data.documentSubType}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <DropdownMenuSeparator />
          {/* Priority Dropdown */}
            <div className="grid grid-cols-2 gap-4">
                  <div className="">
                  <DropdownMenuLabel>Priority</DropdownMenuLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-between", !selectedPriority && "text-muted-foreground")}>
                        {selectedPriority || "Select"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          {priorityOptions.map((priority) => (
                            <CommandItem
                              key={priority}
                              onSelect={() =>{
                                setSelectedPriority(priority)
                                setSearchParams(
                                  (prev) => {
                                    prev.set("priority", priority);
                                    prev.set("currentPage", "1");
                                    return prev;
                                  },
                                  { replace: true },
                                )
                              }
                            }
                            >
                              <Check className={cn("mr-2 h-4 w-4", priority === selectedPriority ? "opacity-100" : "opacity-0")} />
                              {priority}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  </div>
                  <div className="">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-between", !selectedStatus && "text-muted-foreground")}>
                {selectedStatus || "Select"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandList>
                  {statusOptions.map((status) => (
                    <CommandItem
                      key={status}
                      onSelect={() =>{
                        setSelectedStatus(status)
                        setSearchParams(
                          (prev) => {
                            prev.set("status", status);
                            prev.set("currentPage", "1");
                            return prev;
                          },
                          { replace: true },
                        )
                      }
                    }
                    >
                      <Check className={cn("mr-2 h-4 w-4", status === selectedStatus ? "opacity-100" : "opacity-0")} />
                      {status}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
                  </div>
          </div>
          
          
          {/* Status Dropdown */}
         

          <DropdownMenuSeparator />
          {/* Sender Dropdown */}
          <DropdownMenuLabel>Sender</DropdownMenuLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-between", !selectedSenderObject && "text-muted-foreground")}>
                {selectedSenderObject
                  ? `${users?.body?.find((user) => user.id === selectedSenderObject?.id)?.userInfo.firstName} ${users?.body?.find((user) => user.id === selectedSenderObject?.id)?.userInfo.lastName}`
                  : "Select Sender..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandList>
                  {users?.body?.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() =>{
                        setSelectedSender(user.id)
                        setSearchParams(
                          (prev) => {
                            prev.set("senderId", user.id);
                            prev.set("currentPage", "1");
                            return prev;
                          },
                          { replace: true },
                        )
                      }
                    }
                    >
                      <Check className={cn("mr-2 h-4 w-4", user.id === selectedSender ? "opacity-100" : "opacity-0")} />
                      {user.userInfo.firstName} {user.userInfo.lastName}
                    </CommandItem>
                  )) || <CommandEmpty>No users found.</CommandEmpty>}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={()=>{
            clearSearchParams();
            refetch()
            
          }} variant="outline">Clear</Button>
          <Button ref={submitButtonRef} onClick={refetch} disabled={isSubmitting}>Submit</Button>
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
