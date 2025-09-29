import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper function to generate random API key
function generateApiKey(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'lw_';
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Create a new customer
export const createCustomer = mutation({
  args: {
    email: v.string(),
    domain: v.string(),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = generateApiKey();
    const customerId = generateUUID();

    const id = await ctx.db.insert("customers", {
      customerId: customerId,
      apiKey: apiKey,
      openaiApiKey: "", // Customer will add this later
      domain: args.domain,
      isActive: true,
      plan: args.plan || "free",
      createdAt: Date.now(),
      settings: {
        theme: "light",
        position: "bottom-center",
        brandColor: "#C081FF"
      }
    });

    return {
      id,
      customerId,
      apiKey
    };
  },
});

// Get customer by API key
export const getCustomerByApiKey = query({
  args: {
    apiKey: v.string()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    return customer;
  },
});

// Get customer by customer ID
export const getCustomerById = query({
  args: {
    customerId: v.string()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    return customer;
  },
});

// Get all customers
export const getAllCustomers = query({
  args: {},
  handler: async (ctx) => {
    const customers = await ctx.db.query("customers").collect();
    return customers;
  },
});

// Update customer OpenAI API key
export const updateOpenAIKey = mutation({
  args: {
    customerId: v.string(),
    openaiApiKey: v.string()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    await ctx.db.patch(customer._id, {
      openaiApiKey: args.openaiApiKey
    });

    return { success: true };
  },
});

// Update customer settings
export const updateCustomerSettings = mutation({
  args: {
    customerId: v.string(),
    settings: v.object({
      theme: v.string(),
      position: v.string(),
      brandColor: v.string()
    })
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    await ctx.db.patch(customer._id, {
      settings: args.settings
    });

    return { success: true };
  },
});

// Update customer domain
export const updateCustomerDomain = mutation({
  args: {
    customerId: v.string(),
    domain: v.string()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    await ctx.db.patch(customer._id, {
      domain: args.domain
    });

    return { success: true };
  },
});

// Activate/deactivate customer
export const setCustomerActive = mutation({
  args: {
    customerId: v.string(),
    isActive: v.boolean()
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .first();

    if (!customer) {
      throw new Error("Customer not found");
    }

    await ctx.db.patch(customer._id, {
      isActive: args.isActive
    });

    return { success: true };
  },
});

// Regenerate API key for customer
export const regenerateApiKey = mutation({
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

    const newApiKey = generateApiKey();

    await ctx.db.patch(customer._id, {
      apiKey: newApiKey
    });

    return { apiKey: newApiKey };
  },
});

// Delete customer (soft delete by deactivating)
export const deleteCustomer = mutation({
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

    // Soft delete by deactivating
    await ctx.db.patch(customer._id, {
      isActive: false
    });

    return { success: true };
  },
});