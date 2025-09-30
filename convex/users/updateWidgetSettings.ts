import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./helpers";

/**
 * Update user's widget configuration
 */
export const updateWidgetSettings = mutation({
  args: {
    domain: v.optional(v.string()),
    theme: v.optional(v.string()),
    position: v.optional(v.string()),
    brandColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Build update object
    const updates: any = {};

    if (args.domain !== undefined) {
      updates.domain = args.domain;
    }

    // Update settings if any setting fields are provided
    if (args.theme !== undefined || args.position !== undefined || args.brandColor !== undefined) {
      updates.settings = {
        theme: args.theme ?? user.settings?.theme ?? "light",
        position: args.position ?? user.settings?.position ?? "bottom-center",
        brandColor: args.brandColor ?? user.settings?.brandColor ?? "#C081FF",
      };
    }

    // Perform update
    await ctx.db.patch(userId, updates);

    return {
      success: true,
      message: "Settings updated successfully"
    };
  },
});