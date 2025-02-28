import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTranscriptions = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const transcriptions = await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();
    return transcriptions;
  },
});
