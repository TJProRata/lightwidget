import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Public action to initiate a full site crawl
 */
export const initiateCrawl = action({
  args: {},
  handler: async (ctx) => {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Get user to find their domain
    const user = await ctx.runQuery(internal.crawler.getUserCrawlSettings, {
      userId
    });

    if (!user.domain || user.domain.trim() === '') {
      throw new Error("Please set your domain in settings before crawling");
    }

    if (!user.crawlSettings.enableFullSiteCrawl) {
      throw new Error("Full site crawl is not enabled. Please enable it in settings.");
    }

    // Construct start URL from domain
    let startUrl = user.domain;
    if (!startUrl.startsWith('http://') && !startUrl.startsWith('https://')) {
      startUrl = 'https://' + startUrl;
    }

    // Start the crawl
    const result = await ctx.runAction(internal.crawler.startSiteCrawl, {
      userId,
      startUrl
    });

    return result;
  }
});

/**
 * Query to get crawl status for current user
 */
export const getCrawlStatus = query({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) {
        throw new Error("Not authenticated");
      }

      // Log for debugging
      console.log("getCrawlStatus - userId from getAuthUserId:", userId);

      // Validate the userId format
      if (typeof userId !== 'string' || userId.includes('|')) {
        console.error("Invalid userId format received:", userId);
        // Try to get the actual user from the database
        const user = await ctx.db.get(userId as any);
        if (!user) {
          throw new Error("User not found");
        }
        return await ctx.runQuery(internal.crawler.getCrawlStatus, { userId: user._id });
      }

      return await ctx.runQuery(internal.crawler.getCrawlStatus, { userId });
    } catch (error) {
      console.error("Error in getCrawlStatus:", error);
      // Return a default status if there's an error
      return {
        status: 'idle',
        totalPages: 0,
        lastCrawl: null,
        error: null
      };
    }
  }
});

/**
 * Query to get all indexed pages for current user
 */
export const getIndexedPages = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) {
        throw new Error("Not authenticated");
      }

      // Log for debugging
      console.log("getIndexedPages - userId from getAuthUserId:", userId);

      // Validate the userId format - if it has a pipe, it's not a valid ID
      if (typeof userId !== 'string' || userId.includes('|')) {
        console.error("Invalid userId format in getIndexedPages:", userId);
        // Return empty array if userId is invalid
        return [];
      }

      const pages = await ctx.db
        .query("sitePages")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(args.limit || 50);

      return pages.map(page => ({
        _id: page._id,
        url: page.url,
        title: page.title,
        status: page.status,
        depth: page.depth,
        lastCrawled: page.lastCrawled,
        error: page.error
      }));
    } catch (error) {
      console.error("Error in getIndexedPages:", error);
      // Return empty array on error
      return [];
    }
  }
});

/**
 * Mutation to clear all indexed pages for current user
 */
export const clearIndexedPages = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (userId === null) {
        throw new Error("Not authenticated");
      }

      // Log for debugging
      console.log("clearIndexedPages - userId from getAuthUserId:", userId);

      // Validate the userId format
      if (typeof userId !== 'string' || userId.includes('|')) {
        console.error("Invalid userId format in clearIndexedPages:", userId);
        // Can't proceed with invalid userId
        return { success: false, message: "Invalid user ID format" };
      }

      // Get all pages for this user
      const pages = await ctx.db
        .query("sitePages")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      // Delete all pages
      for (const page of pages) {
        await ctx.db.delete(page._id);
      }

    // Reset crawl status
    const user = await ctx.db.get(userId);
    if (user && user.crawlSettings) {
      await ctx.db.patch(userId, {
        crawlSettings: {
          ...user.crawlSettings,
          crawlStatus: 'idle',
          totalPagesIndexed: 0,
          lastCrawlDate: undefined,
          lastCrawlError: undefined
        }
      });
    }

      return {
        success: true,
        deletedCount: pages.length
      };
    } catch (error) {
      console.error("Error in clearIndexedPages:", error);
      return {
        success: false,
        message: "Failed to clear indexed pages",
        deletedCount: 0
      };
    }
  }
});

/**
 * Query to search indexed pages (used by AI for context)
 */
export const searchIndexedPages = query({
  args: {
    userId: v.id("users"),
    query: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(internal.crawler.searchSitePages, {
      userId: args.userId,
      query: args.query,
      limit: args.limit || 3
    });
  }
});
