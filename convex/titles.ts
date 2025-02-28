import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTitles = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const titles = await ctx.db
      .query("titles")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();
    return titles;
  },
});
