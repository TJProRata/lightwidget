import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Store customer accounts for multi-tenancy
  customers: defineTable({
    customerId: v.string(),
    email: v.string(),
    apiKey: v.string(),
    openaiApiKey: v.string(),
    domain: v.string(),
    isActive: v.boolean(),
    plan: v.string(), // "free", "pro", "enterprise"
    createdAt: v.number(),
    settings: v.optional(v.object({
      theme: v.string(),
      position: v.string(),
      brandColor: v.string()
    }))
  }).index("by_api_key", ["apiKey"]).index("by_customer_id", ["customerId"]),

  // Store chat messages with conversation tree structure
  messages: defineTable({
    customerId: v.optional(v.string()), // NEW: scope to customer
    sessionId: v.optional(v.string()), // Customer's end-user session
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
    customerId: v.optional(v.string()), // NEW: scope to customer
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    timestamp: v.number(),
    userId: v.optional(v.string()),
  }).index("by_customer_id", ["customerId"]),
});