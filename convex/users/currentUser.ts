import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) {
        return null;
      }
      return await ctx.db.get(userId);
    } catch (error) {
      // If auth fails, return null instead of throwing
      console.error("Error getting current user:", error);
      return null;
    }
  },
});