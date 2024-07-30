
import { create } from 'zustand'
export type NotificationType =  {
    inbox:number,
    incoming:number
}

export type NotificationState = {
    notification : NotificationType | null,
    setNotification : (notification:NotificationType | null)=>void
}
export const useNotificationStore = create<NotificationState>((set)=>({
    notification : null,
    setNotification : (notification)=>set({notification})
}));