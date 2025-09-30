import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

export const generateAnswer = action({
  args: {
    query: v.string(),
    userId: v.string(),
    sequenceNumber: v.number(),
    conversationPath: v.string(),
  },
  handler: async (ctx, args) => {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant for TechNews. Provide concise, informative answers about technology, news, and general topics."
          },
          {
            role: "user",
            content: args.query
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const answer = completion.choices[0]?.message?.content || "No response generated";

      // Save to database via mutation (with customerId for multi-tenancy)
      const messageId = await ctx.runMutation(api.messages.sendMessage, {
        query: args.query,
        answer: answer,
        sources: [
          { name: 'OpenAI', percentage: 100 }
        ],
        suggestions: ['Tell me more', 'Related topics', 'Latest updates'],
        userId: args.userId,
        customerId: undefined, // No customerId for legacy generateAnswer
        sessionId: args.userId,
        sequenceNumber: args.sequenceNumber,
        conversationPath: args.conversationPath,
      });

      return {
        _id: messageId,
        query: args.query,
        answer: answer,
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`Failed to generate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Generate answer with webpage context (multi-tenant version)
export const generateAnswerWithContext = action({
  args: {
    query: v.string(),
    userId: v.string(),
    sequenceNumber: v.number(),
    conversationPath: v.string(),
    url: v.string(),
    apiKey: v.optional(v.string()), // Customer's widget API key
    customerId: v.optional(v.string()), // Direct customer ID (alternative to apiKey)
  },
  handler: async (ctx, args) => {
    let customerId = args.customerId;

    // If customerId not provided, validate API key to get it
    if (!customerId && args.apiKey) {
      const customer = await ctx.runQuery(api.auth.validateApiKey, {
        apiKey: args.apiKey
      });
      customerId = customer.userId;
    }

    // Always use centralized OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured in Convex environment variables");
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    try {
      // Fetch webpage content from Convex (scoped to customer)
      const webpageContent = await ctx.runQuery(api.webpage.getWebpageContent, {
        url: args.url,
        customerId: customerId,
      });

      // Build system message with webpage context
      let systemMessage = "You are a helpful AI assistant. Provide concise, informative answers.";

      if (webpageContent) {
        systemMessage += `\n\nYou have access to the content of the current webpage the user is viewing:\n\nPage Title: ${webpageContent.title}\n\nPage Content:\n${webpageContent.content.substring(0, 4000)}`; // Limit content to avoid token overflow
      }

      // Call OpenAI API with context
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: args.query
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const answer = completion.choices[0]?.message?.content || "No response generated";

      // Save to database via mutation (with customerId for multi-tenancy)
      const messageId = await ctx.runMutation(api.messages.sendMessage, {
        query: args.query,
        answer: answer,
        sources: [
          { name: 'OpenAI', percentage: 100 }
        ],
        suggestions: ['Tell me more', 'Related topics', 'Latest updates'],
        userId: args.userId,
        customerId: customerId, // Use resolved customerId for multi-tenant support
        sessionId: args.userId,
        sequenceNumber: args.sequenceNumber,
        conversationPath: args.conversationPath,
      });

      return {
        _id: messageId,
        query: args.query,
        answer: answer,
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`Failed to generate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});