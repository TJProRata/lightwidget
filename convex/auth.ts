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

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    if (!customer) {
      throw new Error("Invalid API key");
    }

    if (!customer.isActive) {
      throw new Error("Customer account is inactive");
    }

    return {
      customerId: customer.customerId,
      settings: customer.settings,
      domain: customer.domain,
      plan: customer.plan,
      hasOpenAIKey: customer.openaiApiKey !== ""
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

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    if (!customer) {
      throw new Error("Invalid API key");
    }

    if (!customer.isActive) {
      throw new Error("Customer account is inactive");
    }

    // Validate origin against customer's allowed domain
    // Support wildcards like *.example.com or specific domains
    const allowedDomains = customer.domain.split(',').map(d => d.trim());

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
      throw new Error(`Unauthorized domain: ${args.origin}. Allowed domains: ${customer.domain}`);
    }

    return {
      customerId: customer.customerId,
      settings: customer.settings,
      domain: customer.domain,
      plan: customer.plan,
      hasOpenAIKey: customer.openaiApiKey !== ""
    };
  },
});

// Get customer's OpenAI API key (used internally by actions)
export const getCustomerOpenAIKey = query({
  args: {
    customerId: v.string()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!customer.openaiApiKey || customer.openaiApiKey === "") {
      throw new Error("OpenAI API key not configured for this customer");
    }

    return {
      openaiApiKey: customer.openaiApiKey
    };
  },
});