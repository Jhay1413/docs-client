import { notification } from "@/features/transactions/schema/TransactionSchema";
import { z } from "zod";
import { create } from "zustand";
export type NotificationType = {
  inbox: number;
  incoming: number;
  refetch?: () => void;
  refetchAll?: () => void;
};

export type NotificationState = {
  notification: NotificationType | null;
  numOfUnreadNotif: number;
  setNumOfUnreadNotif: (numOfUnreadNotif: number) => void;
  setNotification: (notification: NotificationType | null) => void;
  refetch: (() => void) | null;
  refetchAll: (() => void) | null;
  setRefetchAll: (refetchFn: () => void) => void;
  setRefetch: (refetchFn: () => void) => void;
};
export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  numOfUnreadNotif: 0,
  refetch: null,
  refetchAll: null,
  setNumOfUnreadNotif: (numOfUnreadNotif) => set({ numOfUnreadNotif }),
  setRefetchAll: (refetchFn) => set({ refetchAll: refetchFn }),
  setNotification: (notification) => set({ notification }),
  setRefetch: (refetchFn) => set({ refetch: refetchFn }),
}));

export type TicketNotificationType = {
  incomingTickets: number,
  inboxTickets: number,
  refetch?: () => void;
  refetchAll?: () => void;
}

export type TicketNotificationState = {
  ticketNotification: TicketNotificationType | null;
  numOfUnreadTicketNotif: number;
  setNumOfUnreadTicketNotif: (numOfUnreadTicketNotif: number) => void;
  setTicketNotification: (ticketNotification: TicketNotificationType | null) => void;
  refetch: (() => void) | null;
  refetchAll: (() => void) | null;
  setRefetchAll: (refetchFn: () => void) => void;
  setRefetch: (refetchFn: () => void) => void;
}

export const useTicketNotificationStore = create<TicketNotificationState>((set) => ({
  ticketNotification: null,
  numOfUnreadTicketNotif: 0,
  refetch: null,
  refetchAll: null,
  setNumOfUnreadTicketNotif: (numOfUnreadTicketNotif) => set({ numOfUnreadTicketNotif }),
  setRefetchAll: (refetchFn) => set({ refetchAll: refetchFn }),
  setTicketNotification: (ticketNotification) => set({ ticketNotification }),
  setRefetch: (refetchFn) => set({ refetch: refetchFn }),
}));