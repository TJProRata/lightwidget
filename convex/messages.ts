import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all messages
export const getMessages = query({
  args: {
    userId: v.optional(v.string()),
    tabId: v.optional(v.id("chatTabs"))
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .order("desc")
      .take(100);

    // Filter by userId and/or tabId if provided
    let filtered = messages;

    if (args.userId) {
      filtered = filtered.filter(msg => msg.userId === args.userId);
    }

    if (args.tabId) {
      filtered = filtered.filter(msg => msg.tabId === args.tabId);
    }

    return filtered;
  },
});

// Send a new message (store the search result)
export const sendMessage = mutation({
  args: {
    query: v.string(),
    answer: v.string(),
    sources: v.optional(v.array(v.object({
      name: v.string(),
      percentage: v.number()
    }))),
    suggestions: v.optional(v.array(v.string())),
    userId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    tabId: v.optional(v.id("chatTabs")),
    parentMessageId: v.optional(v.id("messages")),
    sequenceNumber: v.optional(v.number()),
    conversationPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // If no sequence/path provided, calculate them
    let sequenceNumber = args.sequenceNumber || 0;
    let conversationPath = args.conversationPath || "0";

    // If this is continuing from a parent message, calculate next values
    if (args.parentMessageId) {
      const parent = await ctx.db.get(args.parentMessageId);
      if (parent) {
        sequenceNumber = parent.sequenceNumber + 1;
        conversationPath = parent.conversationPath + "." + sequenceNumber;
      }
    }

    // Handle userId vs sessionId properly
    let finalUserId = undefined;
    let finalSessionId = args.sessionId;

    // Check if userId is actually a session string
    if (args.userId && args.userId.startsWith('session_')) {
      // It's a session string, not a real user ID
      finalSessionId = args.userId;
      // Use customerId as the actual userId if provided
      if (args.customerId) {
        finalUserId = args.customerId;
      }
    } else if (args.userId && !args.userId.startsWith('session_')) {
      // It's a real user ID
      finalUserId = args.userId;
    }

    const messageId = await ctx.db.insert("messages", {
      query: args.query,
      answer: args.answer,
      sources: args.sources,
      suggestions: args.suggestions,
      userId: finalUserId,
      sessionId: finalSessionId,
      tabId: args.tabId,
      parentMessageId: args.parentMessageId,
      sequenceNumber: sequenceNumber,
      conversationPath: conversationPath,
      timestamp: Date.now(),
    });

    return messageId;
  },
});

// Get a specific message by ID
export const getMessage = query({
  args: {
    messageId: v.id("messages")
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

// Delete a message
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

// Search messages by query text
export const searchMessages = query({
  args: {
    searchText: v.string(),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .order("desc")
      .collect();

    // Filter by search text
    const filtered = messages.filter(msg =>
      msg.query.toLowerCase().includes(args.searchText.toLowerCase()) ||
      msg.answer.toLowerCase().includes(args.searchText.toLowerCase())
    );

    // If userId is provided, further filter by user
    if (args.userId) {
      return filtered.filter(msg => msg.userId === args.userId);
    }

    return filtered;
  },
});

// Get conversation path from a specific message (for navigation)
export const getConversationPath = query({
  args: {
    messageId: v.id("messages"),
    tabId: v.optional(v.id("chatTabs"))
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return [];

    // Get all messages in the conversation path up to this point
    const allMessages = await ctx.db
      .query("messages")
      .filter((q) =>
        args.tabId
          ? q.and(q.eq(q.field("tabId"), args.tabId), q.lte(q.field("sequenceNumber"), message.sequenceNumber))
          : q.lte(q.field("sequenceNumber"), message.sequenceNumber)
      )
      .order("asc", "sequenceNumber")
      .collect();

    // Filter to only include messages that are ancestors or the message itself
    const pathMessages = allMessages.filter(msg => {
      return message.conversationPath.startsWith(msg.conversationPath) ||
             msg.conversationPath.startsWith(message.conversationPath);
    });

    return pathMessages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  },
});

// Delete branch - remove all messages that come after a specific message in the conversation tree
export const deleteBranch = mutation({
  args: {
    fromMessageId: v.id("messages"),
    tabId: v.optional(v.id("chatTabs")),
    userId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const fromMessage = await ctx.db.get(args.fromMessageId);
    if (!fromMessage) return 0;

    // Find all messages that come after this message in the conversation
    let query = ctx.db.query("messages");

    // Filter by userId if provided to only delete messages from the same session
    if (args.userId || fromMessage.userId) {
      const userId = args.userId || fromMessage.userId;
      query = query.filter((q) => q.eq(q.field("userId"), userId));
    }

    const allMessages = await query.collect();

    // Delete messages that are descendants of the current path
    let deletedCount = 0;
    for (const message of allMessages) {
      // If this message has a higher sequence number than the fromMessage
      // and belongs to the same conversation (same userId)
      if (message.sequenceNumber > fromMessage.sequenceNumber &&
          message.userId === fromMessage.userId) {
        await ctx.db.delete(message._id);
        deletedCount++;
      }
    }

    return deletedCount;
  },
});

// Clear all messages for a specific session/user
export const clearSessionMessages = mutation({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    let deletedCount = 0;
    for (const message of messages) {
      await ctx.db.delete(message._id);
      deletedCount++;
    }

    return deletedCount;
  },
});

// Clear ALL messages from the database (for fresh start on page load)
export const clearAllMessages = mutation({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("messages")
      .collect();

    let deletedCount = 0;
    for (const message of messages) {
      await ctx.db.delete(message._id);
      deletedCount++;
    }

    console.log(`Cleared ${deletedCount} messages from database`);
    return deletedCount;
  },
});