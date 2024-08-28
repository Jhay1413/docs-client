import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

interface NotificationState {
  messages: string[];
  addNotification: (message: string) => void;
  socket: Socket;
  initializeSocket: () => void;
  receiverId: string | null;
  setReceiverId: (id: string) => void;
}

const useRealtimeStore = create<NotificationState>((set) => {
  const mode = import.meta.env.VITE_MODE;

  const backendUrl =
    mode == "DEVELOPMENT"
      ? import.meta.env.VITE_PROD_API
      : import.meta.env.VITE_DEV_API;
  return {
    socket: io(backendUrl),
    //socket: io("http://localhost:3001"),
    receiverId: null, // Initialize the socket here
    initializeSocket: () =>
      set((state) => ({
        socket: io(backendUrl), //Reinitialize if needed
      })),
    messages: [],
    addNotification: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
    setReceiverId: () => set((state) => ({ receiverId: state.receiverId })),
  };
});

export default useRealtimeStore;
