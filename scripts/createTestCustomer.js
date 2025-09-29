/**
 * Script to create a test customer in Convex
 * Run with: node scripts/createTestCustomer.js
 */

import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = "https://impartial-vulture-278.convex.cloud";

async function createTestCustomer() {
  const client = new ConvexHttpClient(CONVEX_URL);

  try {
    console.log("Creating test customer...");

    const result = await client.mutation("customers:createCustomer", {
      email: "test@lightwidget.com",
      domain: "localhost",
      plan: "free"
    });

    console.log("\n✅ Test customer created successfully!");
    console.log("\n📋 Customer Details:");
    console.log("   Email: test@lightwidget.com");
    console.log("   Domain: localhost");
    console.log("   Customer ID:", result.customerId);
    console.log("   API Key:", result.apiKey);
    console.log("\n📝 To use this in your widget, set:");
    console.log(`   window.LightWidgetConfig = { apiKey: '${result.apiKey}' };`);
    console.log("\n⚠️  IMPORTANT: Save this API key! You'll need it to test the widget.");
    console.log("\n💡 To update the OpenAI key for this customer:");
    console.log("   Use the Convex dashboard or create an admin function");
  } catch (error) {
    console.error("❌ Error creating test customer:", error);
    process.exit(1);
  }
}

createTestCustomer();