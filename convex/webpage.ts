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
    userId: v.optional(v.string()),
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let customerId: string | undefined = undefined;

    // Validate API key if provided
    if (args.apiKey) {
      const customer = await ctx.runQuery(api.auth.validateApiKey, {
        apiKey: args.apiKey
      });
      customerId = customer.customerId;
    }

    // Check if content for this URL already exists for this customer
    let query = ctx.db.query("webpageContent");

    if (customerId) {
      query = query.withIndex("by_customer_id", (q) =>
        q.eq("customerId", customerId)
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
        userId: args.userId,
        customerId: customerId,
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
      customerId: customerId,
    });

    return id;
  },
});

// Store webpage content (legacy, direct customerId)
export const storeWebpageContent = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    userId: v.optional(v.string()),
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if content for this URL already exists for this customer
    let query = ctx.db.query("webpageContent");

    if (args.customerId) {
      query = query.withIndex("by_customer_id", (q) =>
        q.eq("customerId", args.customerId)
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
        userId: args.userId,
        customerId: args.customerId,
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
      customerId: args.customerId,
    });

    return id;
  },
});

// Get webpage content by URL
export const getWebpageContent = query({
  args: {
    url: v.string(),
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("webpageContent");

    if (args.customerId) {
      query = query.withIndex("by_customer_id", (q) =>
        q.eq("customerId", args.customerId)
      );
    }

    const allContent = await query.collect();
    const content = allContent.find(c => c.url === args.url);

    return content;
  },
});

// Clear all webpage content (optionally scoped to customer)
export const clearAllWebpageContent = mutation({
  args: {
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("webpageContent");

    if (args.customerId) {
      query = query.withIndex("by_customer_id", (q) =>
        q.eq("customerId", args.customerId)
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