import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getSignUrlForView } from "@/features/transactions/services/getSignedUrl";

interface AttachmentsModalProps {
  attachments: string[];
}

const viewFile = async (key: string) => {
    const signedUrl = await getSignUrlForView(key);
    if (signedUrl) {
      window.open(signedUrl);
    }
  };

const AttachmentsModal: React.FC<AttachmentsModalProps> = ({ attachments }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="link">View Attachments</Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="max-w-lg">
      <AlertDialogHeader>
        <AlertDialogTitle>Attachments</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        <ul>
            <ScrollArea className="max-w-md h-40 truncate gap-2 overflow-hidden">
                {attachments.length > 0 ? (
                    attachments.map((attachment, index) => (
                        <li key={index} className="p-4 hover:text-blue-600">
                            <a target="_blank" rel="noopener noreferrer" onClick={() => viewFile(attachment)}>
                            {`${index + 1}. ${attachment}`}
                            </a>
                        </li>
                    ))
                ) : (
                    <span>No attachments available</span>
                )}
                <ScrollBar orientation="horizontal" />
            </ScrollArea>   
        </ul>
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction asChild>
          <Button>Close</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default AttachmentsModal;
