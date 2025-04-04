"use client";

import type { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const DashboardPage = () => {
  // All hooks must be called at the top level, before any conditional returns
  const { data: session } = useSession();
  const [ messages, setMessages ] = useState<Message[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isSwitchLoading, setIsSwitchLoading ] = useState<boolean>(false);

  // Form validation
  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });
  const acceptMessages = watch('acceptMessages');

  // Fetch Accept Messages
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
        const response = await axios.get<ApiResponse>(`/api/accept-messages`);
        setValue('acceptMessages', response.data?.isAcceptingMessages as boolean);
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data?.message || "Failed to fetch accept messages status");
    } finally {
        setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch Messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data?.messages || []);
      if (refresh) {
        toast.success("Refreshed Messages- Showing latest messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, setIsSwitchLoading]);

  // Fetch initial data
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  // Handle Delete Message
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId));
  }

  // Handle switch change
  const handleSwitchChange = async () => {
    if (!session || !session.user) return;
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", { 
        acceptMessages: !acceptMessages });
      if (response.data?.success) {
        toast.success(response.data.message || "Accept messages status updated successfully");
        setValue('acceptMessages', !acceptMessages);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to update accept messages status");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Early return after all hooks
  if (!session || !session.user) return null;
  
  // Handle copy to clipboard
  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={profileUrl} 
            disabled 
            className="input input-bordered w-full p-2 mr-2" 
          />
          <button 
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
      </div>
      <div className="mb-4">
        <Switch 
          {...register('acceptMessages')}
          disabled={isSwitchLoading}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
        />
        <span className="ml-2">
          Accept messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      <Button
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
        disabled={isLoading}
        className="mt-4"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? messages.map((message) => (
          <MessageCard
            key={message._id as string}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        )) : (
          <p className="text-sm">No message to display</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage;