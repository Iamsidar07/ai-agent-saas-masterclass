import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    videoId: v.string(),
    userId: v.string(),
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
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  transcript: defineTable({
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        timestamp: v.string(),
        text: v.string(),
      })
    ),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  images: defineTable({
    storageId: v.id("_storage"),
    videoId: v.string(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
  titles: defineTable({
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
});
