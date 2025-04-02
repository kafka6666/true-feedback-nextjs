"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const VerifyAccountPage = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verifyCode: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/verify-user', {
                username: decodeURIComponent(params.username),
                code: data.verifyCode,
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
                router.replace('/sign-in');
            } else {
                toast.error(response.data.message || "Verification failed");
            }
        } catch (error: unknown) {
            console.error("Error in verification of user: ", error);
            
            // Handle different error status codes
            if ((error as { response?: { data?: { message?: string } } }).response) {
                const errorMessage = (error as { response: { data?: { message?: string } } }).response.data?.message || "Verification failed";
                toast.error(errorMessage);
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">
                    Enter the verification code sent to your email for <span className="font-medium">{decodeURIComponent(params.username)}</span>
                </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="verifyCode"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter 6-digit verification code" 
                                            {...field} 
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Verifying...
                                </>
                            ) : 'Verify Account'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccountPage;