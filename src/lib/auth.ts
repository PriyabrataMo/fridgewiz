import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";

/**
 * Get the current authenticated user from Clerk
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Try to get user from database first
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist in database, create it
    if (!user) {
      const clerkUser = await currentUser();

      if (clerkUser) {
        user = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
            name:
              clerkUser.firstName && clerkUser.lastName
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.lastName || null,
            avatar: clerkUser.imageUrl || null,
          },
        });
      }
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Require authentication and return the current user
 * Throws an error if user is not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Get the current user's ID from Clerk
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}
