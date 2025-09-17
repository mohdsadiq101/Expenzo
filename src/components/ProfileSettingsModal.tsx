"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { Settings, Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ProfileSettingsModal() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file upload
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

    setUser({
      name,
      profileImage,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border border-gray-300">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            Profile Settings
          </DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Profile Image (clickable with edit icon) */}
          <div className="flex justify-center">
            <div
              className="relative cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-20 w-20 border-3 border-gray-400">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback>
                  {name ? name[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>

              {/* Edit Icon */}
              <div className="absolute bottom-0 right-0 border-1 border-gray-300 bg-white rounded-full p-1 shadow-md hover:bg-gray-200">
                <Pencil className="h-4 w-4 text-gray-600" />
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name input */}
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

        {/* Footer */}
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
