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
      try {
        console.log("createOrUpdateUser called with:", {
          existingUserId: args.existingUserId,
          profile: args.profile,
          provider: args.provider
        });

        // Check if user exists
        const existingUser = args.existingUserId
          ? await ctx.db.get(args.existingUserId)
          : null;

        // If user exists, update the profile but preserve custom fields
        if (existingUser) {
          const updateData = {
            ...args.profile,
            // Preserve existing custom fields
            apiKey: existingUser.apiKey || generateApiKey(),
            isActive: existingUser.isActive !== undefined ? existingUser.isActive : true,
            plan: existingUser.plan || "free",
            createdAt: existingUser.createdAt || Date.now(),
          };

          await ctx.db.patch(existingUser._id, updateData);
          console.log("Updated existing user:", existingUser._id);
          return existingUser._id;
        }

        // Create new user with all required custom fields
        const newUserData = {
          ...args.profile,
          // Set all required custom fields with defaults
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
        };

        const userId = await ctx.db.insert("users", newUserData);
        console.log("Created new user:", userId);
        return userId;
      } catch (error) {
        console.error("Error in createOrUpdateUser:", error);
        throw error;
      }
    },
  },
});