"use client";

import { useState } from "react"; 
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter(); 

  // zod implementation for form validation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // handle onSubmit functionality after submitting the form
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log(result);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Incorrect email or password');
      } else {
        toast.error(result.error);
      }
    }

    if (result?.url) {
      toast.success("Login successful");
      router.replace('/dashboard');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback here
          </h1>
          <p className="mb-4">
            Sign in to start your adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ashley@example.com or ashley123" 
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
              ) : ('Sign In') }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
            <p>
              Don&apos;t have an account?{' '}
              <Link 
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800">
                  Sign Up
              </Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage;