import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all chat tabs for a user
export const getChatTabs = query({
  args: {
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const tabs = await ctx.db
      .query("chatTabs")
      .order("desc")
      .take(50);

    if (args.userId) {
      return tabs.filter(tab => tab.userId === args.userId);
    }

    return tabs;
  },
});

// Create a new chat tab
export const createChatTab = mutation({
  args: {
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tabId = await ctx.db.insert("chatTabs", {
      title: args.title,
      query: args.query,
      userId: args.userId,
      timestamp: Date.now(),
      isActive: true,
    });

    return tabId;
  },
});

// Update chat tab active status
export const updateChatTab = mutation({
  args: {
    tabId: v.id("chatTabs"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.tabId, {
      isActive: args.isActive,
    });
  },
});

// Delete a chat tab
export const deleteChatTab = mutation({
  args: {
    tabId: v.id("chatTabs")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tabId);
  },
});

// Get prompt history
export const getPromptHistory = query({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("promptHistory").order("desc");

    const limit = args.limit || 20;
    const history = await query.take(limit);

    if (args.userId) {
      return history.filter(item => item.userId === args.userId);
    }

    return history;
  },
});

// Add to prompt history
export const addToPromptHistory = mutation({
  args: {
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const historyId = await ctx.db.insert("promptHistory", {
      title: args.title,
      query: args.query,
      userId: args.userId,
      timestamp: Date.now(),
    });

    return historyId;
  },
});

// Clear prompt history for a user
export const clearPromptHistory = mutation({
  args: {
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const history = await ctx.db.query("promptHistory").collect();

    const toDelete = args.userId
      ? history.filter(item => item.userId === args.userId)
      : history;

    for (const item of toDelete) {
      await ctx.db.delete(item._id);
    }

    return toDelete.length;
  },
});

// Clear ALL chat tabs from the database
export const clearAllChatTabs = mutation({
  args: {},
  handler: async (ctx) => {
    const tabs = await ctx.db
      .query("chatTabs")
      .collect();

    let deletedCount = 0;
    for (const tab of tabs) {
      await ctx.db.delete(tab._id);
      deletedCount++;
    }

    console.log(`Cleared ${deletedCount} chat tabs from database`);
    return deletedCount;
  },
});

// Clear ALL prompt history from the database
export const clearAllPromptHistory = mutation({
  args: {},
  handler: async (ctx) => {
    const prompts = await ctx.db
      .query("promptHistory")
      .collect();

    let deletedCount = 0;
    for (const prompt of prompts) {
      await ctx.db.delete(prompt._id);
      deletedCount++;
    }

    console.log(`Cleared ${deletedCount} prompts from history`);
    return deletedCount;
  },
});