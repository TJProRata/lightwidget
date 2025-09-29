import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Store chat messages with conversation tree structure
  messages: defineTable({
    query: v.string(),
    answer: v.string(),
    sources: v.optional(v.array(v.object({
      name: v.string(),
      percentage: v.number()
    }))),
    suggestions: v.optional(v.array(v.string())),
    userId: v.optional(v.string()),
    tabId: v.optional(v.id("chatTabs")),
    parentMessageId: v.optional(v.id("messages")), // Reference to parent message for tree structure
    sequenceNumber: v.number(), // Order in the conversation (0, 1, 2, etc.)
    conversationPath: v.string(), // Path like "0" or "0.1" or "0.1.2" for branching
    timestamp: v.number(),
  }),

  // Store chat tabs
  chatTabs: defineTable({
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.string()),
    timestamp: v.number(),
    isActive: v.boolean(),
  }),

  // Store prompt history
  promptHistory: defineTable({
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.string()),
    timestamp: v.number(),
  }),

  // Store suggestions
  suggestions: defineTable({
    text: v.string(),
    category: v.string(), // "default" or "more"
    usageCount: v.number(),
  }),

  // Store autocomplete data
  autocompleteData: defineTable({
    text: v.string(),
    category: v.optional(v.string()),
    popularity: v.number(),
  }),

  // Store webpage content for context-aware responses
  webpageContent: defineTable({
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    timestamp: v.number(),
    userId: v.optional(v.string()),
  }),
});