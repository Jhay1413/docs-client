import { useCallback } from "react";


export const usePrint = () =>{
    const printDiv = useCallback((divId:string) => {
        const content = document.getElementById(divId)?.innerHTML;

        if(!content){
            console.log("something went wrong ")
            return
        }
        const printWindow = window.open("", "", "width=800,height=600");
        if (!printWindow) {
          console.error("Failed to open print window");
          return;
        }
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" href="../App.css">');
        printWindow.document.write("</head><body>");
        printWindow.document.write('<div class="print-content">');
        printWindow.document.write(content);
        printWindow.document.write('</div>');
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, []);
    
      return printDiv;
    };
