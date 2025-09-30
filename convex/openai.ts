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
      const customer = await ctx.runQuery(api.apiKeyAuth.validateApiKey, {
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
      let systemMessage = `You are an AI assistant embedded on a webpage as a chat widget. You have been given the content of the webpage and related pages from the same website. You MUST use this provided context to answer questions.

IMPORTANT INSTRUCTIONS:
- When asked "what is this page" or "what is on this page", describe the current page content provided below
- When asked about any topic, FIRST check if it's mentioned in the provided page content
- Use ONLY the provided page content to answer questions - do not make up information
- If the information isn't in the provided context, say "I don't have information about that on this page"
- Always be specific and reference the actual content you were given`;
      let contextSources = [];

      // Add current page context
      if (webpageContent) {
        systemMessage += `\n\n=== CURRENT PAGE (The page the user is viewing right now) ===\nTitle: ${webpageContent.title}\nURL: ${webpageContent.url}\n\nContent:\n${webpageContent.content.substring(0, 2000)}\n`; // Reduced to 2000 to make room for other pages
        contextSources.push({ name: webpageContent.title, url: webpageContent.url });
      } else {
        systemMessage += `\n\n=== NO PAGE CONTENT CAPTURED ===\nThe webpage content could not be captured. This may be because:\n1. The page is still loading\n2. The widget was just installed\n3. There was an error capturing the content\n\nWhen asked about "this page", explain that you don't have access to the page content at the moment.\n`;
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
              systemMessage += `\n\n=== RELATED PAGES FROM THIS WEBSITE ===\n`;
              systemMessage += `The following pages from the same website contain information related to the user's question:\n`;

              relevantPages.forEach((page, index) => {
                systemMessage += `\n--- Page ${index + 1}: ${page.title} ---\nURL: ${page.url}\nContent:\n${page.content}\n`;
                contextSources.push({ name: page.title, url: page.url });
              });

              systemMessage += `\nIMPORTANT: Use information from these related pages to provide comprehensive answers. When you use information from a related page, mention which page it came from.`;
            }
          }
        } catch (error) {
          console.error("Error searching indexed pages:", error);
          // Continue with just current page context
        }
      }

      // Add final reminder to use context
      systemMessage += `\n\nREMEMBER: You are answering questions about the specific webpage content provided above. Always use this context to answer questions. If asked "what is this page" or similar, describe the current page content.`;

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