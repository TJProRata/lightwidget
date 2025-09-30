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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.runQuery(internal.crawler.getCrawlStatus, { userId });
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
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
  }
});

/**
 * Mutation to clear all indexed pages for current user
 */
export const clearIndexedPages = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
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
