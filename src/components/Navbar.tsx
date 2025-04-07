"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user as User;

    const handleSignOut = () => {
        signOut();
    };

  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <Link
                className="text-xl font-bold mb-4 md:mb-0"
                href="/">
                    True Feedback
            </Link>
            {session ? (
                <div className="flex items-center">
                    <span 
                        className="mr-4">
                            Welcome, {user?.username || user?.email}
                    </span>
                    <Button 
                        className="m-auto rounded"
                        onClick={handleSignOut}>
                            Sign Out
                    </Button>
                </div>
            ) : (
                <Link href="/sign-in">
                    <Button 
                        className="m-auto rounded">
                            Sign In
                    </Button>
                </Link>
            )}          
        </div>
    </nav>
  )
}

export default Navbar;