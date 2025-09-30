import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Helper to normalize URLs
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash, fragments, and sort query params
    parsed.hash = '';
    if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

// Helper to extract domain from URL
function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return '';
  }
}

// Helper to check if URL matches exclude patterns
function shouldExclude(url: string, excludePatterns: string[]): boolean {
  return excludePatterns.some(pattern => {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(regexPattern);
    return regex.test(url);
  });
}

// Extract page content and metadata
async function extractPageContent(html: string, url: string) {
  // Simple HTML parsing without external dependencies
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].trim() : undefined;

  // Extract meta keywords
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
  const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : undefined;

  // Extract headings
  const headings: string[] = [];
  const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
  for (const match of h1Matches) {
    headings.push(match[1].trim());
  }
  const h2Matches = html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
  for (const match of h2Matches) {
    headings.push(match[1].trim());
  }

  // Extract text content (remove scripts, styles, and HTML tags)
  let textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit content size
  if (textContent.length > 50000) {
    textContent = textContent.substring(0, 50000);
  }

  // Extract HTML snippet (first 1000 chars of cleaned HTML)
  const htmlSnippet = html.substring(0, 1000);

  // Find all links
  const links: string[] = [];
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["']/gi);
  for (const match of linkMatches) {
    try {
      const href = match[1];
      // Skip fragments, mailto, tel, javascript links
      if (href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('javascript:')) {
        continue;
      }

      // Convert relative URLs to absolute
      const absoluteUrl = new URL(href, url).toString();
      links.push(absoluteUrl);
    } catch {
      // Invalid URL, skip
    }
  }

  return {
    title,
    content: textContent,
    htmlSnippet,
    metadata: {
      description,
      keywords,
      headings: headings.slice(0, 10) // Limit to 10 headings
    },
    links
  };
}

// Internal mutation to store a crawled page
export const storeCrawledPage = internalMutation({
  args: {
    userId: v.id("users"),
    url: v.string(),
    title: v.string(),
    content: v.string(),
    htmlSnippet: v.string(),
    metadata: v.object({
      description: v.optional(v.string()),
      keywords: v.optional(v.array(v.string())),
      headings: v.optional(v.array(v.string()))
    }),
    depth: v.number(),
    status: v.string(),
    parentUrl: v.optional(v.string()),
    error: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check if page already exists
    const existing = await ctx.db
      .query("sitePages")
      .withIndex("by_user_and_url", (q) =>
        q.eq("userId", args.userId).eq("url", args.url)
      )
      .first();

    if (existing) {
      // Update existing page
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        htmlSnippet: args.htmlSnippet,
        metadata: args.metadata,
        depth: args.depth,
        status: args.status,
        lastCrawled: Date.now(),
        parentUrl: args.parentUrl,
        error: args.error
      });
      return existing._id;
    }

    // Insert new page
    return await ctx.db.insert("sitePages", {
      userId: args.userId,
      url: args.url,
      title: args.title,
      content: args.content,
      htmlSnippet: args.htmlSnippet,
      metadata: args.metadata,
      depth: args.depth,
      status: args.status,
      lastCrawled: Date.now(),
      parentUrl: args.parentUrl,
      error: args.error
    });
  }
});

// Internal mutation to update crawl status
export const updateCrawlStatus = internalMutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
    totalPages: v.optional(v.number()),
    error: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const crawlSettings = user.crawlSettings || {
      enableFullSiteCrawl: false,
      maxPages: 100,
      maxDepth: 3,
      excludePatterns: [],
      crawlStatus: 'idle'
    };

    await ctx.db.patch(args.userId, {
      crawlSettings: {
        ...crawlSettings,
        crawlStatus: args.status,
        totalPagesIndexed: args.totalPages,
        lastCrawlDate: Date.now(),
        lastCrawlError: args.error
      }
    });
  }
});

// Internal query to get user's crawl settings
export const getUserCrawlSettings = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    return {
      domain: user.domain || '',
      crawlSettings: user.crawlSettings || {
        enableFullSiteCrawl: false,
        maxPages: 100,
        maxDepth: 3,
        excludePatterns: [],
        crawlStatus: 'idle'
      }
    };
  }
});

// Action to crawl a single page
export const crawlPage = action({
  args: {
    userId: v.id("users"),
    url: v.string(),
    depth: v.number(),
    parentUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const normalizedUrl = normalizeUrl(args.url);

    try {
      // Fetch the page
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'LightWidget-Crawler/1.0'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const pageData = await extractPageContent(html, normalizedUrl);

      // Store the page
      await ctx.runMutation(internal.crawler.storeCrawledPage, {
        userId: args.userId,
        url: normalizedUrl,
        title: pageData.title,
        content: pageData.content,
        htmlSnippet: pageData.htmlSnippet,
        metadata: pageData.metadata,
        depth: args.depth,
        status: 'crawled',
        parentUrl: args.parentUrl
      });

      return {
        success: true,
        url: normalizedUrl,
        links: pageData.links,
        title: pageData.title
      };
    } catch (error: any) {
      // Store error status
      await ctx.runMutation(internal.crawler.storeCrawledPage, {
        userId: args.userId,
        url: normalizedUrl,
        title: 'Error',
        content: '',
        htmlSnippet: '',
        metadata: { headings: [] },
        depth: args.depth,
        status: 'error',
        parentUrl: args.parentUrl,
        error: error.message
      });

      return {
        success: false,
        url: normalizedUrl,
        error: error.message,
        links: []
      };
    }
  }
});

// Main action to start full site crawl
export const startSiteCrawl = action({
  args: {
    userId: v.id("users"),
    startUrl: v.string()
  },
  handler: async (ctx, args) => {
    // Get user settings
    const userSettings = await ctx.runQuery(internal.crawler.getUserCrawlSettings, {
      userId: args.userId
    });

    const { maxPages, maxDepth, excludePatterns } = userSettings.crawlSettings;
    const baseDomain = extractDomain(args.startUrl);

    // Update status to in_progress
    await ctx.runMutation(internal.crawler.updateCrawlStatus, {
      userId: args.userId,
      status: 'in_progress'
    });

    // BFS queue
    const queue: Array<{ url: string; depth: number; parentUrl?: string }> = [
      { url: args.startUrl, depth: 0 }
    ];
    const visited = new Set<string>();
    let crawledCount = 0;

    try {
      while (queue.length > 0 && crawledCount < maxPages) {
        const current = queue.shift()!;
        const normalizedUrl = normalizeUrl(current.url);

        // Skip if already visited
        if (visited.has(normalizedUrl)) continue;
        visited.add(normalizedUrl);

        // Skip if excluded
        if (shouldExclude(normalizedUrl, excludePatterns)) continue;

        // Skip if different domain
        const currentDomain = extractDomain(normalizedUrl);
        if (currentDomain !== baseDomain) continue;

        // Skip if max depth exceeded
        if (current.depth > maxDepth) continue;

        // Crawl the page
        const result = await ctx.runAction(internal.crawler.crawlPage, {
          userId: args.userId,
          url: normalizedUrl,
          depth: current.depth,
          parentUrl: current.parentUrl
        });

        if (result.success) {
          crawledCount++;

          // Add child pages to queue
          if (current.depth < maxDepth) {
            for (const link of result.links) {
              const normalizedLink = normalizeUrl(link);
              if (!visited.has(normalizedLink)) {
                queue.push({
                  url: normalizedLink,
                  depth: current.depth + 1,
                  parentUrl: normalizedUrl
                });
              }
            }
          }
        }

        // Rate limiting: wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Update final status
      await ctx.runMutation(internal.crawler.updateCrawlStatus, {
        userId: args.userId,
        status: 'completed',
        totalPages: crawledCount
      });

      return {
        success: true,
        totalPages: crawledCount,
        message: `Successfully crawled ${crawledCount} pages`
      };
    } catch (error: any) {
      // Update error status
      await ctx.runMutation(internal.crawler.updateCrawlStatus, {
        userId: args.userId,
        status: 'error',
        totalPages: crawledCount,
        error: error.message
      });

      return {
        success: false,
        totalPages: crawledCount,
        error: error.message
      };
    }
  }
});

// Query to get crawl status for a user
export const getCrawlStatus = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const crawlSettings = user.crawlSettings;
    const totalPages = await ctx.db
      .query("sitePages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
      .then(pages => pages.length);

    return {
      status: crawlSettings?.crawlStatus || 'idle',
      totalPagesIndexed: totalPages,
      lastCrawlDate: crawlSettings?.lastCrawlDate,
      lastCrawlError: crawlSettings?.lastCrawlError
    };
  }
});

// Query to search site pages for a user
export const searchSitePages = internalQuery({
  args: {
    userId: v.id("users"),
    query: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("sitePages")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "crawled")
      )
      .collect();

    const queryLower = args.query.toLowerCase();

    // Simple relevance scoring based on keyword matches
    const scored = pages
      .map(page => {
        let score = 0;
        const titleLower = page.title.toLowerCase();
        const contentLower = page.content.toLowerCase();

        // Title matches are weighted higher
        if (titleLower.includes(queryLower)) score += 10;

        // Count keyword occurrences in content
        const occurrences = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
        score += occurrences;

        return { page, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, args.limit || 5);

    return scored.map(item => ({
      _id: item.page._id,
      url: item.page.url,
      title: item.page.title,
      content: item.page.content.substring(0, 1000), // Return first 1000 chars
      relevanceScore: item.score
    }));
  }
});
