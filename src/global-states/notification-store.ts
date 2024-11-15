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

