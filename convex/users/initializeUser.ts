import { mutation } from "../_generated/server";
import { requireAuth, generateApiKey } from "./helpers";

/**
 * Initialize a new user's widget configuration
 * Called after first Google sign-in
 */
export const initializeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);

    // Check if user already has widget config
    if (user?.apiKey) {
      return { success: true, message: "User already initialized", apiKey: user.apiKey };
    }

    // Generate unique API key
    const apiKey = generateApiKey();

    // Update user with widget configuration
    await ctx.db.patch(userId, {
      apiKey,
      openaiApiKey: "",
      domain: "",
      isActive: true,
      plan: "free",
      createdAt: Date.now(),
      settings: {
        theme: "light",
        position: "bottom-center",
        brandColor: "#C081FF"
      }
    });

    return {
      success: true,
      message: "User initialized successfully",
      apiKey
    };
  },
});