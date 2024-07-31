import { create } from "zustand";
export type NotificationType = {
  inbox: number;
  incoming: number;
  refetch: () => void;
};

export type NotificationState = {
  notification: NotificationType | null;
  setNotification: (notification: NotificationType | null) => void;
  refetch: (() => void) | null;
  setRefetch: (refetchFn: () => void) => void;
};
export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  refetch: null,
  setNotification: (notification) => set({ notification }),
  setRefetch: (refetchFn) => set({ refetch: refetchFn }),
}));
