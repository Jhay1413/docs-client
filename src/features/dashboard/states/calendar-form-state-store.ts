import { create } from "zustand";



export type CalendarFormStoreType = {
    isOpen :boolean;
    selectedDate : Date,
    setIsOpen :  (value:boolean) => void;
    setSelectedDate : (value :Date)=>void;
}

export const useCalendarFormState = create<CalendarFormStoreType>((set)=>({
    isOpen : false,
    setIsOpen:(value)=>set(()=>({isOpen:value})),
    selectedDate : new Date(),
    setSelectedDate : (value)=>set(()=>({selectedDate : value}))
}))
