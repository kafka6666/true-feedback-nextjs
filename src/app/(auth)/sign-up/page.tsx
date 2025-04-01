"use client";

import { useEffect, useState } from "react"; 
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>('');
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // debounced setUsername callback function
  const debouncedSetUsername = useDebounceCallback(setUsername, 500);

  const router = useRouter(); 

  // zod implementation for form validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // check username availability
  useEffect(() => {
    const checkUsernameUnique = async () => {
      // Only check if username meets minimum requirements (3+ chars)
      if (username && username.trim().length >= 3) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get<ApiResponse>(`/api/check-usrnm-unique?username=${username}`);
          const { message } = response.data;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as Error;
          // Only set error message if it's a validation error, not for empty checks
          if (username.trim().length >= 3) {
            setUsernameMessage(axiosError.message);
            console.error("Error checking username: ", error);
          }
        } finally {
          setIsCheckingUsername(false);
        }
      } else if (username.trim() !== '') {
        // If username exists but is too short, show appropriate message
        setUsernameMessage("Username must be at least 3 characters long");
        setIsCheckingUsername(false);
      } else {
        // Clear messages if username is empty
        setUsernameMessage('');
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [username]);

  // handle onSubmit functionality after submitting the form
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      
      if (response.data.success) {
        toast.success(response.data.message);
        router.replace(`/verify/${username}`);
      } else {
        setUsernameMessage(response.data.message);
      }
    } catch (error) {
      const axiosError = error as Error;
      setUsernameMessage(axiosError.message);
      console.error("Error in signing up of user: ", axiosError);
      toast.error(axiosError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback here
          </h1>
          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ashley123" 
                      {...field} 
                      onChange={(e)=> {
                        field.onChange(e);
                        debouncedSetUsername(e.target.value);
                      }}  
                      />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4"/>}
                  {usernameMessage && (
                    <p 
                      className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ashley@example.com" 
                      {...field}  
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password here" 
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
              >
              { isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Please wait ...
                </>
              ) : ('Sign Up') }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link 
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800">
                  Sign In
              </Link>
            </p>
        </div>
      </div>
    </div>
  )
}