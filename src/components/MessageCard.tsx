"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Message } from "@/model/user.model";
import { toast } from "sonner";
import axios from "axios";
import type { ApiResponse } from "@/types/ApiResponse";
  
interface MessageCardProps {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast.success(response.data?.message || "Message deleted successfully");
        onMessageDelete(message._id as string);
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><X className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}>
                            Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardDescription>{message.createdAt.toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>{message.content}</p>
        </CardContent>
    </Card>
  )
}

export default MessageCard;