import { query } from "./_generated/server";
import { v } from "convex/values";

// Get message count by customer
export const getMessageCountByCustomer = query({
  args: {
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("messages");

    if (args.customerId) {
      const messages = await query.collect();
      const filtered = messages.filter(m => m.customerId === args.customerId);
      return filtered.length;
    }

    const messages = await query.collect();
    return messages.length;
  },
});

// Get total messages across all customers
export const getTotalMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return messages.length;
  },
});

// Get messages by date range
export const getMessagesByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
    customerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.gte(q.field("timestamp"), args.startDate),
          q.lte(q.field("timestamp"), args.endDate)
        )
      )
      .collect();

    if (args.customerId) {
      return messages.filter(m => m.customerId === args.customerId);
    }

    return messages;
  },
});

// Get usage statistics for a customer
export const getCustomerUsageStats = query({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();
    const customerMessages = messages.filter(m => m.customerId === args.customerId);

    // Calculate stats
    const totalQueries = customerMessages.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const queriesToday = customerMessages.filter(
      m => m.timestamp && m.timestamp >= todayTimestamp
    ).length;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7DaysTimestamp = last7Days.getTime();

    const queriesLast7Days = customerMessages.filter(
      m => m.timestamp && m.timestamp >= last7DaysTimestamp
    ).length;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const last30DaysTimestamp = last30Days.getTime();

    const queriesLast30Days = customerMessages.filter(
      m => m.timestamp && m.timestamp >= last30DaysTimestamp
    ).length;

    return {
      totalQueries,
      queriesToday,
      queriesLast7Days,
      queriesLast30Days,
    };
  },
});

// Get top customers by usage
export const getTopCustomersByUsage = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const messages = await ctx.db.query("messages").collect();
    const customers = await ctx.db.query("customers").collect();

    // Count messages per customer
    const usageCounts = new Map<string, number>();
    messages.forEach(msg => {
      if (msg.customerId) {
        usageCounts.set(
          msg.customerId,
          (usageCounts.get(msg.customerId) || 0) + 1
        );
      }
    });

    // Create array with customer data and usage
    const customerUsage = customers
      .map(customer => ({
        customerId: customer.customerId,
        email: customer.email,
        domain: customer.domain,
        messageCount: usageCounts.get(customer.customerId) || 0,
      }))
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, limit);

    return customerUsage;
  },
});