"use client";

import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "./Button";
import { LogInIcon, LogOutIcon, UserIcon } from "./Icons";

export function AuthButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  // const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
      </Button>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* User Info */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "User"}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
            </div>
          )}
          <span className="text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
            {user.fullName || user.emailAddresses[0]?.emailAddress}
          </span>
        </div>

        {/* Sign Out Button */}
        <SignOutButton>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <LogOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <LogInIcon className="w-4 h-4" />
        <span>Sign In</span>
      </Button>
    </SignInButton>
  );
}
