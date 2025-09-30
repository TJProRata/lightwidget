import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Users table (replaces customers, merged with Convex Auth)
  users: defineTable({
    // Convex Auth fields
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    // Google OAuth fields
    googleId: v.optional(v.string()),
    // LightWidget custom fields - ALL OPTIONAL for auth compatibility
    apiKey: v.optional(v.string()), // Will be set in auth callback
    openaiApiKey: v.optional(v.string()),
    domain: v.optional(v.string()),
    isActive: v.optional(v.boolean()), // Will default to true in auth callback
    plan: v.optional(v.string()), // Will default to "free" in auth callback
    createdAt: v.optional(v.number()), // Will be set in auth callback
    settings: v.optional(v.object({
      theme: v.string(),
      position: v.string(),
      brandColor: v.string()
    }))
  })
    .index("email", ["email"])
    .index("by_api_key", ["apiKey"]),

  // Store chat messages with conversation tree structure
  messages: defineTable({
    userId: v.optional(v.id("users")), // User who owns this widget
    sessionId: v.optional(v.string()), // End-user session on customer's website
    query: v.string(),
    answer: v.string(),
    sources: v.optional(v.array(v.object({
      name: v.string(),
      percentage: v.number()
    }))),
    suggestions: v.optional(v.array(v.string())),
    tabId: v.optional(v.id("chatTabs")),
    parentMessageId: v.optional(v.id("messages")), // Reference to parent message for tree structure
    sequenceNumber: v.number(), // Order in the conversation (0, 1, 2, etc.)
    conversationPath: v.string(), // Path like "0" or "0.1" or "0.1.2" for branching
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  // Store chat tabs
  chatTabs: defineTable({
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.id("users")),
    timestamp: v.number(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),

  // Store prompt history
  promptHistory: defineTable({
    title: v.string(),
    query: v.string(),
    userId: v.optional(v.id("users")),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

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
    userId: v.optional(v.id("users")), // User who owns this widget
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.optional(v.string()),
    timestamp: v.number(),
    sessionId: v.optional(v.string()), // End-user session
  }).index("by_user", ["userId"]),
});