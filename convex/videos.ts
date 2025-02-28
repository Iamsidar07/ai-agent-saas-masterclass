import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVideoById = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();
    return videos;
  },
});

export const getVideos = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return videos;
  },
});

export const createVideo = mutation({
  args: {
    userId: v.string(),
    videoId: v.string(),
    title: v.string(),
    description: v.string(),
    thumbnail: v.string(),
    views: v.number(),
    publishedAt: v.string(),
    author: v.object({
      subscribersCount: v.number(),
      channelName: v.string(),
      avatar: v.string(),
      channel_url: v.string(),
      username: v.string(),
      user_url: v.string(),
      isVerified: v.boolean(),
      keywords: v.array(v.string()),
      category: v.string(),
      lengthSeconds: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const isVideoExist = await ctx.db
      .query("videos")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();

    if (isVideoExist.length) return isVideoExist;
    const video = await ctx.db.insert("videos", args);
    return video;
  },
});
