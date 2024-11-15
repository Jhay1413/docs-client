import React, { createContext, useContext, useEffect } from "react";
import { socket } from "./socket";

interface TicketingSocketContextProps {
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const TicketingSocketContext = createContext<TicketingSocketContextProps | undefined>(undefined);

export const useTicketingSocket = () => {
  const context = useContext(TicketingSocketContext);
  if (!context) {
    throw new Error("useTicketingSocket must be used within a TicketingSocketProvider");
  }
  return context;
};

export const TicketingSocketProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  useEffect(() => {
    socket.connect();
    socket.emit("joinTicketRoom", userId);

    return () => {
      socket.emit("leaveTicketRoom", userId);
      socket.disconnect();
    };
  }, [userId]);

  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("joinTicketRoom", userId);
    }
  };

  const disconnectSocket = () => {
    socket.emit("leaveTicketRoom", userId);
    socket.disconnect();
  };

  return (
    <TicketingSocketContext.Provider value={{ connectSocket, disconnectSocket }}>
      {children}
    </TicketingSocketContext.Provider>
  );
};
