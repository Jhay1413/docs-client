import { usePrint } from "@/hooks/print";

type PrintButtonProps  = {
    divId: string;
  }
  
  export const PrintButton: React.FC<PrintButtonProps> = ({ divId }) => {
    const printDiv = usePrint();
  
    return <button onClick={() => printDiv(divId)}>Print Div</button>;
  };
  