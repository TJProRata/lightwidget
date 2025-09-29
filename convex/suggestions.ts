import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get suggestions
export const getSuggestions = query({
  args: {
    category: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("suggestions");

    if (args.category) {
      const suggestions = await query.collect();
      return suggestions
        .filter(s => s.category === args.category)
        .sort((a, b) => b.usageCount - a.usageCount);
    }

    const suggestions = await query.collect();
    return suggestions.sort((a, b) => b.usageCount - a.usageCount);
  },
});

// Add or update a suggestion
export const upsertSuggestion = mutation({
  args: {
    text: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if suggestion already exists
    const existing = await ctx.db
      .query("suggestions")
      .filter(q => q.eq(q.field("text"), args.text))
      .first();

    if (existing) {
      // Increment usage count
      await ctx.db.patch(existing._id, {
        usageCount: existing.usageCount + 1,
      });
      return existing._id;
    } else {
      // Create new suggestion
      const suggestionId = await ctx.db.insert("suggestions", {
        text: args.text,
        category: args.category,
        usageCount: 1,
      });
      return suggestionId;
    }
  },
});

// Get autocomplete data
export const getAutocompleteData = query({
  args: {
    searchText: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("autocompleteData")
      .order("desc")
      .collect();

    let filtered = data;

    // Filter by search text if provided
    if (args.searchText) {
      filtered = data.filter(item =>
        item.text.toLowerCase().includes(args.searchText.toLowerCase())
      );
    }

    // Sort by popularity
    filtered.sort((a, b) => b.popularity - a.popularity);

    // Apply limit
    const limit = args.limit || 10;
    return filtered.slice(0, limit);
  },
});

// Add autocomplete data
export const addAutocompleteData = mutation({
  args: {
    text: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("autocompleteData")
      .filter(q => q.eq(q.field("text"), args.text))
      .first();

    if (existing) {
      // Increment popularity
      await ctx.db.patch(existing._id, {
        popularity: existing.popularity + 1,
      });
      return existing._id;
    } else {
      // Create new
      const dataId = await ctx.db.insert("autocompleteData", {
        text: args.text,
        category: args.category,
        popularity: 1,
      });
      return dataId;
    }
  },
});

// Initialize default suggestions (run once to seed data)
export const initializeDefaultSuggestions = mutation({
  args: {},
  handler: async (ctx) => {
    const defaultSuggestions = [
      { text: "Top Stories", category: "default" },
      { text: "Breaking News", category: "default" },
      { text: "Generate a new Wordle", category: "default" },
      { text: "Technology updates", category: "more" },
      { text: "Climate change news", category: "more" },
      { text: "Sports scores", category: "more" },
      { text: "Stock market trends", category: "more" },
      { text: "Weather forecast", category: "more" },
      { text: "Entertainment news", category: "more" },
    ];

    const defaultAutocomplete = [
      "Airline industry news",
      "Amazon news updates",
      "Apartment hunting tips",
      "Apple earnings report",
      "Art exhibition reviews",
      "Artificial intelligence",
      "Australia travel guide",
      "Automotive industry trends",
    ];

    // Add suggestions
    for (const suggestion of defaultSuggestions) {
      const existing = await ctx.db
        .query("suggestions")
        .filter(q => q.eq(q.field("text"), suggestion.text))
        .first();

      if (!existing) {
        await ctx.db.insert("suggestions", {
          text: suggestion.text,
          category: suggestion.category,
          usageCount: 0,
        });
      }
    }

    // Add autocomplete data
    for (const text of defaultAutocomplete) {
      const existing = await ctx.db
        .query("autocompleteData")
        .filter(q => q.eq(q.field("text"), text))
        .first();

      if (!existing) {
        await ctx.db.insert("autocompleteData", {
          text: text,
          category: undefined,
          popularity: 0,
        });
      }
    }

    return "Default data initialized";
  },
});