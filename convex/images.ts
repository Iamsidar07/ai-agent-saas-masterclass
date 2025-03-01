import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getImages = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();

    const imageUrls = await Promise.all(
      images.map(async (img) => ({
        ...img,
        url: await ctx.storage.getUrl(img.storageId),
      }))
    );
    return imageUrls;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


export const storeImage = mutation({
  args: {
    storageId: v.id("_storage"),
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async(ctx, args)=>{
    const imageId = await ctx.db.insert("images", {
      storageId: args.storageId,
      userId: args.userId,
      videoId: args.videoId,
    })
    return imageId
  }
})

export const getImage = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async(ctx, args)=>{
    const image = await ctx.db
      .query("images")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();
    

      if(!image) return null
    return await ctx.storage.getUrl(image.storageId)
  }
})