import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTranscriptionById = query({
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
    return transcriptions[0];
  },
});

export const createTranscription = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        timestamp: v.string(),
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existingTranscription = await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();

    if (existingTranscription) {
      return existingTranscription;
    }

    const transcription = await ctx.db.insert("transcript", {
      videoId: args.videoId,
      userId: args.userId,
      transcript: args.transcript,
    });

    return transcription;
  },
});
