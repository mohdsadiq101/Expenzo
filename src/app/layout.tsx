// src/app/layout.tsx 
import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // <-- change here
import "./globals.css";
import { TransactionProvider } from "@/context/TransactionContext";
import { UserProvider } from "@/context/UserContext";
import { BottomNav } from "@/components/BottomNav";

// Use Nunito instead of Inter
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // add weights you’ll use
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "A mini expense tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}> {/* <-- swapped */}
        <TransactionProvider>
          <UserProvider>
            {children}
            <BottomNav />
          </UserProvider>
        </TransactionProvider>
      </body>
    </html>
  );
}
