import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { keepPreviousData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { tsr } from "@/services/tsr";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
  
interface FilterOptionsProps {
    onFilterChange: (filters: {
      project?: string;
      transaction?: string;
      priority?: string;
      status?: string;
      user?: string;
    }) => void;
  }
  
export function FilterOptions({ onFilterChange }: FilterOptionsProps) {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectectedType, setSelectedType] = useState("");
    const [selectedUser, setSelectedUser] = useState("")
  
    const priorityOptions = ["Urgent", "Important", "Low"];
    const statusOptions = ["For Routing", "On Process", "Ongoing", "Completed", "Approved", "For Sign and Seal"];
  
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
            type: selectectedType,
          },
        },
      });
  
    // Handlers
    const handleSelectProject = (projectName: string) => {
        setSelectedProject(projectName);
        onFilterChange({ project: projectName });
      };
    
      const handleSelectTransaction = (transactionId: string) => {
        setSelectedTransaction(transactionId);
        onFilterChange({ transaction: transactionId });
      };
    
      const handleSelectPriority = (priority: string) => {
        setSelectedPriority(priority);
        onFilterChange({ priority: priority });
      };
    
      const handleSelectStatus = (status: string) => {
        setSelectedStatus(status);
        onFilterChange({ status: status });
      };
    
      const handleSelectUser = (user: string) => {
        setSelectedUser(user);
        onFilterChange({ user: user });
      };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="flex justify-between items-start">
            <Button variant="outline">
                <SlidersHorizontal className="mr-2 text-gray-500" />
                Filter
            </Button>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <div>
            <DropdownMenuSeparator />
            {/* Project Search */}
            <DropdownMenuLabel>Project</DropdownMenuLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("justify-between w-full", !selectedProject && "text-muted-foreground")}
                >
                  {selectedProject || "Search Project..."}
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
                        <CommandItem
                          value={data.id}
                          key={data.id}
                          onSelect={() => handleSelectProject(data.projectName)}
                        >
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
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("justify-between w-full", !selectedTransaction && "text-muted-foreground")}
                >
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
                          onSelect={() => handleSelectTransaction(data.transactionId)}
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
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-between", !selectedPriority && "text-muted-foreground")}>
                  {selectedPriority || "Select Priority..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandList>
                    {priorityOptions.map((priority) => (
                      <CommandItem key={priority} onSelect={() => handleSelectPriority(priority)}>
                        <Check className={cn("mr-2 h-4 w-4", priority === selectedPriority ? "opacity-100" : "opacity-0")} />
                        {priority}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
  
            <DropdownMenuSeparator />
            {/* Status Dropdown */}
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-between", !selectedStatus && "text-muted-foreground")}>
                  {selectedStatus || "Select Status..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandList>
                    {statusOptions.map((status) => (
                      <CommandItem key={status} onSelect={() => handleSelectStatus(status)}>
                        <Check className={cn("mr-2 h-4 w-4", status === selectedStatus ? "opacity-100" : "opacity-0")} />
                        {status}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
                    
            <DropdownMenuSeparator />
            {/* Sender Dropdown */}
            <DropdownMenuLabel>Sender</DropdownMenuLabel>
            <Popover>
            <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-between", !selectedUser && "text-muted-foreground")}>
                {selectedUser ? `${users?.body?.find((user) => user.id === selectedUser)?.userInfo.firstName} ${users?.body?.find((user) => user.id === selectedUser)?.userInfo.lastName}` : "Select Sender..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                <CommandList>
                    {users?.body?.map((user) => (
                    <CommandItem key={user.id} value={user.id} onSelect={() => handleSelectUser(user.id)}>
                        <Check className={cn("mr-2 h-4 w-4", user.id === selectedUser ? "opacity-100" : "opacity-0")} />
                        {user.userInfo.firstName} {user.userInfo.lastName}
                    </CommandItem>
                    )) || (
                    <CommandEmpty>No users found.</CommandEmpty>
                    )}
                </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
          </div>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  