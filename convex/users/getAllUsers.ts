import { query } from "../_generated/server";
import { requireAdmin } from "./helpers";

/**
 * Get all users - Admin only
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Check admin permission
    await requireAdmin(ctx);

    // Return all users
    const users = await ctx.db.query("users").collect();

    // Don't return sensitive data like OpenAI keys
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      googleId: user.googleId,
      apiKey: user.apiKey,
      domain: user.domain,
      isActive: user.isActive,
      plan: user.plan,
      createdAt: user.createdAt,
      settings: user.settings,
      hasOpenAIKey: !!user.openaiApiKey && user.openaiApiKey !== "",
    }));
  },
});