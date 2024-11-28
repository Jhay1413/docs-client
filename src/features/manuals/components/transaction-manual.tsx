import { Button } from "@/components/ui/button";

const OpenBtn = () => (
    <a href="/DTS - Transaction Storyboard.pdf">
    <Button type="button" variant="outline" className="flex items-center gap-2">
        Open
    </Button>
    </a>
)

const DownloadBtn = () => (
    <a href="/DTS - Transaction Storyboard.pdf" download>
        <Button type="button" variant="outline" className="flex items-center gap-2">
            Download
        </Button>
    </a>
);

export const TransactionManual = () => {
    return (
        <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg">
            <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
                <div className="flex justify-between items-center w-full pb-4">
                    <div className="flex justify-start w-full flex-col">
                        <h1 className="text-[#404041] font-medium text-[28px]">Transaction Storyboard</h1>
                        <p className="text-muted-foreground text-[12px] truncate">This is your guide to have a wonderful Transaction experience. Stay sharp and unconfused.</p>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <div className="flex m-1 text-gray-700 gap-1">
                            
                        <OpenBtn />     
                        <DownloadBtn />                      
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <iframe 
                        src="/DTS - Transaction Storyboard.pdf" 
                        style={{ width: '100%', height: '600px', }} 
                        title="User  Manual"
                    >
                        This browser does not support PDFs. Please download the PDF to view it: <a href="/DTS - Transaction Storyboard.pdf">Download PDF</a>
                    </iframe>
                </div>
            </div>
        </div>
    );
};