// src/components/ProfileSettingsModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// NEW: Define the props the component will accept
interface ProfileSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSettingsModal({ open, onOpenChange }: ProfileSettingsModalProps) {
  const { user, setUser } = useUser();
  // REMOVED: The internal 'open' state is now controlled by the parent

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync local state if user context changes
  useEffect(() => {
    setName(user?.name || "");
    setProfileImage(user?.profileImage || "");
  }, [user]);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    setUser({ name, profileImage });
    onOpenChange(false); // Close the modal
  };

  return (
    // Pass the props to the Dialog component
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* REMOVED: The <DialogTrigger> is gone from this file */}
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border border-gray-300">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Profile Settings</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <div
              className="relative cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-20 w-20 border-3 border-gray-400">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>{name ? name[0].toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 border-1 border-gray-300 bg-white rounded-full p-1 shadow-md hover:bg-gray-200">
                <Pencil className="h-4 w-4 text-gray-600" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-black text-white hover:bg-gray-900"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}