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
    // Crawl settings
    enableFullSiteCrawl: v.optional(v.boolean()),
    maxPages: v.optional(v.number()),
    maxDepth: v.optional(v.number()),
    excludePatterns: v.optional(v.array(v.string())),
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

    // Update crawl settings if any crawl fields are provided
    if (
      args.enableFullSiteCrawl !== undefined ||
      args.maxPages !== undefined ||
      args.maxDepth !== undefined ||
      args.excludePatterns !== undefined
    ) {
      const existingCrawlSettings = user.crawlSettings || {
        enableFullSiteCrawl: false,
        maxPages: 100,
        maxDepth: 3,
        excludePatterns: [],
        crawlStatus: 'idle'
      };

      updates.crawlSettings = {
        ...existingCrawlSettings,
        enableFullSiteCrawl: args.enableFullSiteCrawl ?? existingCrawlSettings.enableFullSiteCrawl,
        maxPages: args.maxPages ?? existingCrawlSettings.maxPages,
        maxDepth: args.maxDepth ?? existingCrawlSettings.maxDepth,
        excludePatterns: args.excludePatterns ?? existingCrawlSettings.excludePatterns,
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