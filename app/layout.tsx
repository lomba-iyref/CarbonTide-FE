import type { Metadata } from "next";
import { poppins } from "@/utils/font";
import Navbar from "@/components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import ChatBot from "@/components/chatbot";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Carbontide",
  description: "Trade your carbon credit here!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={poppins.className+" flex flex-col items-center w-screen overflow-x-hidden"}>
        <Analytics />
        <AuthProvider>
          <TooltipProvider>
            <Navbar />
            {children}
            <ChatBot />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}