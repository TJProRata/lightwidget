import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store webpage content
export const storeWebpageContent = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if content for this URL already exists
    const existing = await ctx.db
      .query("webpageContent")
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();

    if (existing) {
      // Update existing content
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        htmlSnippet: args.htmlSnippet,
        timestamp: Date.now(),
        userId: args.userId,
      });
      return existing._id;
    }

    // Insert new content
    const id = await ctx.db.insert("webpageContent", {
      url: args.url,
      title: args.title,
      content: args.content,
      htmlSnippet: args.htmlSnippet,
      timestamp: Date.now(),
      userId: args.userId,
    });

    return id;
  },
});

// Get webpage content by URL
export const getWebpageContent = query({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("webpageContent")
      .filter((q) => q.eq(q.field("url"), args.url))
      .first();

    return content;
  },
});

// Clear all webpage content
export const clearAllWebpageContent = mutation({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("webpageContent").collect();

    for (const content of allContent) {
      await ctx.db.delete(content._id);
    }

    return allContent.length;
  },
});

// Clear old webpage content (optional cleanup function)
export const clearOldContent = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;

    const oldContent = await ctx.db
      .query("webpageContent")
      .filter((q) => q.lt(q.field("timestamp"), cutoffTime))
      .collect();

    for (const content of oldContent) {
      await ctx.db.delete(content._id);
    }

    return oldContent.length;
  },
});