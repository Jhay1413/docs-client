import React from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { CircleCheck } from "lucide-react"

interface ConfirmationModalProps {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  triggerButton: React.ReactNode
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  triggerButton,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg">
        <div className="flex justify-between gap-2 text-base">
          <CircleCheck size={24}/>
          {triggerButton}
        </div>
        </Button>
      </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

export default ConfirmationModal
