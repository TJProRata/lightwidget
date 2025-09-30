/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as apiKeyAuth from "../apiKeyAuth.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as openai from "../openai.js";
import type * as suggestions from "../suggestions.js";
import type * as users_currentUser from "../users/currentUser.js";
import type * as users_getAllUsers from "../users/getAllUsers.js";
import type * as users_getUserById from "../users/getUserById.js";
import type * as users_helpers from "../users/helpers.js";
import type * as users_initializeUser from "../users/initializeUser.js";
import type * as users_updateWidgetSettings from "../users/updateWidgetSettings.js";
import type * as webpage from "../webpage.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  apiKeyAuth: typeof apiKeyAuth;
  auth: typeof auth;
  chat: typeof chat;
  customers: typeof customers;
  http: typeof http;
  messages: typeof messages;
  openai: typeof openai;
  suggestions: typeof suggestions;
  "users/currentUser": typeof users_currentUser;
  "users/getAllUsers": typeof users_getAllUsers;
  "users/getUserById": typeof users_getUserById;
  "users/helpers": typeof users_helpers;
  "users/initializeUser": typeof users_initializeUser;
  "users/updateWidgetSettings": typeof users_updateWidgetSettings;
  webpage: typeof webpage;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
