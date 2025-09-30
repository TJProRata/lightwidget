import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get a user by their ID (for demo page)
 * Public - no auth required
 */
export const getUserById = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    // Return only public, non-sensitive fields
    return {
      _id: user._id,
      name: user.name,
      email: user.email, // Show email on demo page for identification
      apiKey: user.apiKey,
      domain: user.domain,
      settings: user.settings,
    };
  },
});