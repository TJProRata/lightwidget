import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Store webpage content with API key validation
export const storeWebpageContentWithApiKey = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId: string | undefined = undefined;

    // Validate API key if provided
    if (args.apiKey) {
      const customer = await ctx.runQuery(api.apiKeyAuth.validateApiKey, {
        apiKey: args.apiKey
      });
      userId = customer.userId;
    }

    // Check if content for this URL already exists for this user
    let query = ctx.db.query("webpageContent");

    if (userId) {
      query = query.withIndex("by_user", (q) =>
        q.eq("userId", userId)
      );
    }

    const allContent = await query.collect();
    const existing = allContent.find(c => c.url === args.url);

    if (existing) {
      // Update existing content
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        htmlSnippet: args.htmlSnippet,
        timestamp: Date.now(),
        sessionId: args.sessionId,
        userId: userId,
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
      sessionId: args.sessionId,
      userId: userId,
    });

    return id;
  },
});

// Store webpage content (legacy, direct userId)
export const storeWebpageContent = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Check if content for this URL already exists for this user
    let query = ctx.db.query("webpageContent");

    if (args.userId) {
      query = query.withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      );
    }

    const allContent = await query.collect();
    const existing = allContent.find(c => c.url === args.url);

    if (existing) {
      // Update existing content
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        htmlSnippet: args.htmlSnippet,
        timestamp: Date.now(),
        sessionId: args.sessionId,
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
      sessionId: args.sessionId,
      userId: args.userId,
    });

    return id;
  },
});

// Get webpage content by URL
export const getWebpageContent = query({
  args: {
    url: v.string(),
    customerId: v.optional(v.string()), // Keep as customerId for backward compatibility but map to userId
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("webpageContent");

    if (args.customerId) {
      query = query.withIndex("by_user", (q) =>
        q.eq("userId", args.customerId)
      );
    }

    const allContent = await query.collect();
    const content = allContent.find(c => c.url === args.url);

    return content;
  },
});

// Clear all webpage content (optionally scoped to user)
export const clearAllWebpageContent = mutation({
  args: {
    customerId: v.optional(v.string()), // Keep as customerId for backward compatibility but map to userId
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("webpageContent");

    if (args.customerId) {
      query = query.withIndex("by_user", (q) =>
        q.eq("userId", args.customerId)
      );
    }

    const allContent = await query.collect();

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