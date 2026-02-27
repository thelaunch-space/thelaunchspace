/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentActivity from "../agentActivity.js";
import type * as agentQueries from "../agentQueries.js";
import type * as blogs from "../blogs.js";
import type * as briefs from "../briefs.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as lib_activityHelper from "../lib/activityHelper.js";
import type * as linkedinPosts from "../linkedinPosts.js";
import type * as manualTasks from "../manualTasks.js";
import type * as pitchBookings from "../pitchBookings.js";
import type * as questions from "../questions.js";
import type * as toolOpportunities from "../toolOpportunities.js";
import type * as topicClusters from "../topicClusters.js";
import type * as workboard from "../workboard.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentActivity: typeof agentActivity;
  agentQueries: typeof agentQueries;
  blogs: typeof blogs;
  briefs: typeof briefs;
  documents: typeof documents;
  http: typeof http;
  "lib/activityHelper": typeof lib_activityHelper;
  linkedinPosts: typeof linkedinPosts;
  manualTasks: typeof manualTasks;
  pitchBookings: typeof pitchBookings;
  questions: typeof questions;
  toolOpportunities: typeof toolOpportunities;
  topicClusters: typeof topicClusters;
  workboard: typeof workboard;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
