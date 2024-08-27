import {create} from 'zustand';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';


interface SidebarState {
    open:boolean,
    setIsOpen:(value:boolean)=>void;
}
const useSidebarState = create<SidebarState>((set) => ({
  open:true,
  setIsOpen:(value)=>set(()=>({open:value}))
}));

export default useSidebarState;
