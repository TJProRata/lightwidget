import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api, internal } from "./_generated/api";

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
      let contextSources = [];

      // Add current page context
      if (webpageContent) {
        systemMessage += `\n\nYou have access to the content of the current webpage the user is viewing:\n\nPage Title: ${webpageContent.title}\nPage URL: ${webpageContent.url}\n\nPage Content:\n${webpageContent.content.substring(0, 2000)}`; // Reduced to 2000 to make room for other pages
        contextSources.push({ name: webpageContent.title, url: webpageContent.url });
      }

      // Check if user has full-site crawl enabled and search indexed pages
      if (customerId) {
        try {
          // Get user to check crawl settings
          const user = await ctx.runQuery(internal.crawler.getUserCrawlSettings, {
            userId: customerId
          });

          if (user.crawlSettings.enableFullSiteCrawl) {
            // Search across all indexed pages for relevant content
            const relevantPages = await ctx.runQuery(api.siteCrawler.searchIndexedPages, {
              userId: customerId,
              query: args.query,
              limit: 3 // Get top 3 most relevant pages
            });

            if (relevantPages.length > 0) {
              systemMessage += `\n\nYou also have access to content from other pages on this website that may be relevant:\n\n`;

              relevantPages.forEach((page, index) => {
                systemMessage += `\n--- Related Page ${index + 1} ---\nTitle: ${page.title}\nURL: ${page.url}\nContent: ${page.content}\n`;
                contextSources.push({ name: page.title, url: page.url });
              });

              systemMessage += `\n\nWhen answering, you can reference information from any of these pages. Always cite which page you're referencing in your answer.`;
            }
          }
        } catch (error) {
          console.error("Error searching indexed pages:", error);
          // Continue with just current page context
        }
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

      // Build sources array with context pages
      const sources = contextSources.length > 0
        ? contextSources.map((source, index) => ({
            name: source.name || `Page ${index + 1}`,
            percentage: Math.round(100 / contextSources.length)
          }))
        : [{ name: 'OpenAI', percentage: 100 }];

      // Save to database via mutation (with customerId for multi-tenancy)
      const messageId = await ctx.runMutation(api.messages.sendMessage, {
        query: args.query,
        answer: answer,
        sources: sources,
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