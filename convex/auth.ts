import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Helper to generate API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'lw_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          googleId: googleProfile.sub,
        };
      },
    }),
    Password,
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Check if user exists
      const existingUser = args.existingUserId
        ? await ctx.db.get(args.existingUserId)
        : null;

      // If user exists, just update the profile
      if (existingUser) {
        await ctx.db.patch(existingUser._id, {
          ...args.profile,
        });
        return existingUser._id;
      }

      // Create new user with required fields
      const userId = await ctx.db.insert("users", {
        ...args.profile,
        apiKey: generateApiKey(),
        openaiApiKey: "",
        domain: "",
        isActive: true,
        plan: "free",
        createdAt: Date.now(),
        settings: {
          theme: "light",
          position: "bottom-center",
          brandColor: "#C081FF"
        }
      });

      return userId;
    },
  },
});