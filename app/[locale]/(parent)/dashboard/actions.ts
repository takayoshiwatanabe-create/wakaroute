"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserPlan } from "@/lib/auth"; // Import UserPlan

// Define a type for child data returned by the server action
interface ChildData {
  id: string;
  email: string;
  monthlyAiDecompositions: number;
  plan: UserPlan;
  lastActivity: string; // This would ideally be a Date and formatted on client
  recentDiscoveries: number;
}

export async function getChildrenProgressAction(): Promise<{ children?: ChildData[]; error?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Authentication required." };
  }

  // Check if the user is a parent, as per CLAUDE.md "保護者は「観察者」" and "保護者UIは子どもの「失敗」ではなく「発見」を伝える設計にする"
  if (session.user.role !== "PARENT") {
    return { error: "Access denied. Only parent accounts can view this dashboard." };
  }

  try {
    const children = await db.user.findMany({
      where: {
        parentId: session.user.id,
      },
      select: {
        id: true,
        email: true,
        monthlyAiDecompositions: true,
        plan: true,
        // In a real application, 'lastActivity' and 'recentDiscoveries' would be
        // derived from actual user activity data. For this example, we'll use mock data.
      },
    });

    // Mock activity data for demonstration
    const mockActivities = [
      "activity_today",
      "activity_yesterday",
      "activity_two_days_ago",
    ];

    const childrenWithMockProgress: ChildData[] = children.map(child => ({
      ...child,
      lastActivity: mockActivities[Math.floor(Math.random() * mockActivities.length)], // Random mock activity
      recentDiscoveries: Math.floor(Math.random() * 10), // Random mock discoveries
    }));

    return { children: childrenWithMockProgress };
  } catch (e) {
    console.error("Failed to fetch children progress:", e);
    return { error: "Failed to load children's progress. Please try again." };
  }
}


