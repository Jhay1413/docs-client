// TicketFormEPD.tsx
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tsr } from "@/services/tsr";
import { keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
const TicketFormEPD = () => {
  const { control, setValue } = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [selectedProject, setSelectedProject] = useState("");
  const [ selectedSection, setSelectedSection ] = useState("");
  if (!control) {
    return <div>Error: No form context found!</div>;
  }
  const { data, isError, error } = tsr.company.fetchCompanyProjectsBySearch.useQuery({
    queryKey: ["projects", debouncedSearchQuery],
    queryData: {
      query: {
        projectName: debouncedSearchQuery,
      },
    },

    placeholderData: keepPreviousData,
  });
  return (
    <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-md mb-4">
      {/* Project (Dropdown Select) */}
      <FormField
        control={control}
        name="sender"
        render={({ field }) => (
          <FormItem className="flex col-span-1 flex-col w-full justify-center">
            <FormLabel>Project</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" className={cn(" justify-between", !field.value && "text-muted-foreground")}>
                    {selectedProject ? selectedProject : "Select Project..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput placeholder="Search Company..." onValueChange={(e) => setSearchQuery(e)} />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {data?.body?.map((data) => (
                        <CommandItem
                          value={data.id}
                          key={data.id}
                          onSelect={() => {
                            setValue("projectId", data.id)
                            setSelectedProject(data.projectName);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", data.id === field.value ? "opacity-100" : "opacity-0")} />
                          {data.projectName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Transaction ID (Input) */}
      <FormField
        control={control}
        name="transactionId"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Transaction ID</FormLabel>
            <FormControl>
              <input
                type="text"
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                {...field}
                placeholder="Enter transaction ID"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TicketFormEPD;