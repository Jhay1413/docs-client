// import { useEntities, useEntity } from "@/hooks/use-query-hook"; // No useMutation imported
// import { z } from "zod";
// import { ticketingFormData } from "../schema/ticketsSchema";

// const baseUrl = import.meta.env.VITE_TICKET_API; // Define your ticket API base URL

// const useTickets = (key: string, endpoint: string) => {
//   const api = `${baseUrl}/${endpoint}`;
//   const result = useEntities<z.infer<typeof ticketingFormData>>(key, api);
//   return result;
// };

// const useTicket = (endpoint: string, key: string, id?: string | null) => {
//   const api = `${baseUrl}/${endpoint}`;
//   const result = useEntity<z.infer<typeof ticketingFormData>>(key, api, id);
//   return result;
// };

// export { useTickets, useTicket }; // No need to export useMutation for now
