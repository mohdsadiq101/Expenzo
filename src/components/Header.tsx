// src/components/Header.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog"; // <-- NEW: Import Dialog components

export function Header() {
  const { user } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // <-- NEW: State to control the modal

  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Hi, {user?.name || "Guest"}!
        </h1>
        <p className="text-sm text-gray-500">{`${month}, ${year}`}</p>
      </div>

      {/* NEW: Dialog wrapper and trigger */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <div className="rounded-full cursor-pointer transition-colors border-3 border-transparent hover:border-teal-500">
            <Avatar className="w-12 h-12">
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.name} />
            ) : (
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          </div>
          
        </DialogTrigger>
        
        {/* The Modal content is now a child of the Dialog */}
        <ProfileSettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </Dialog>
    </header>
  );
}