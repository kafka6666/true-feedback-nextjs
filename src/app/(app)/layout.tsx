import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Dashboard - True Feedback",
  description: "Dashboard page for True Feedback user",
  keywords: ["feedback", "suggestions", "True Feedback"],
  icons: {
    icon: "../favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  )
}
