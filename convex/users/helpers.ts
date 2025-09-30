import { QueryCtx, MutationCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const ADMIN_EMAILS = ["email@prorata.ai", "tj@prorata.ai"];

/**
 * Require that the user is authenticated and return their user ID
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Not authenticated");
  }
  return userId;
}

/**
 * Require that the user is an admin (has admin email)
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await requireAuth(ctx);
  const user = await ctx.db.get(userId);

  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
    throw new Error("Admin access required");
  }

  return { userId, user };
}

/**
 * Generate a unique API key in the format lw_[32 random chars]
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'lw_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}