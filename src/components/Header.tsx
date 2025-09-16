"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal"; // <-- import

export function Header() {
  const { user } = useUser();

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

      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          {user?.profileImage ? (
            <AvatarImage src={user.profileImage} alt={user.name} />
          ) : (
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>

        <ProfileSettingsModal /> {/* <-- Settings button */}
      </div>
    </header>
  );
}
import * as React from "react"