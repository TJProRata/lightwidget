import { v } from "convex/values";
import { query } from "./_generated/server";

// Validate API key and return customer information
export const validateApiKey = query({
  args: {
    apiKey: v.string()
  },
  handler: async (ctx, args) => {
    if (!args.apiKey || args.apiKey.trim() === "") {
      throw new Error("API key is required");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    if (!user) {
      throw new Error("Invalid API key");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    return {
      userId: user._id,
      settings: user.settings,
      domain: user.domain,
      plan: user.plan,
      hasOpenAIKey: !!user.openaiApiKey && user.openaiApiKey !== ""
    };
  },
});

// Validate API key and domain origin
export const validateApiKeyAndOrigin = query({
  args: {
    apiKey: v.string(),
    origin: v.string()
  },
  handler: async (ctx, args) => {
    if (!args.apiKey || args.apiKey.trim() === "") {
      throw new Error("API key is required");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    if (!user) {
      throw new Error("Invalid API key");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    // Validate origin against user's allowed domain
    // Support wildcards like *.example.com or specific domains
    const allowedDomains = (user.domain || "").split(',').map(d => d.trim()).filter(d => d !== "");

    // If no domains configured, allow all (for initial setup)
    if (allowedDomains.length > 0) {
      let isAuthorized = false;
      for (const domain of allowedDomains) {
        // Handle wildcard domains
        if (domain.startsWith('*.')) {
          const baseDomain = domain.substring(2);
          if (args.origin.endsWith(baseDomain)) {
            isAuthorized = true;
            break;
          }
        } else if (args.origin.includes(domain)) {
          isAuthorized = true;
          break;
        }
      }

      if (!isAuthorized) {
        throw new Error(`Unauthorized domain: ${args.origin}. Allowed domains: ${user.domain}`);
      }
    }

    return {
      userId: user._id,
      settings: user.settings,
      domain: user.domain,
      plan: user.plan,
      hasOpenAIKey: !!user.openaiApiKey && user.openaiApiKey !== ""
    };
  },
});

// Get user's OpenAI API key (used internally by actions)
export const getUserOpenAIKey = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.openaiApiKey || user.openaiApiKey === "") {
      throw new Error("OpenAI API key not configured for this user");
    }

    return {
      openaiApiKey: user.openaiApiKey
    };
  },
});