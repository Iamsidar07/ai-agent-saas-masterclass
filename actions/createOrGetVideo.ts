"use server";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { checkFeatureUsageLimit } from "@/lib/checkFeatureUsageLimit";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "./getVideoDetails";

export interface VideoResponse {
  success: boolean;
  error?: string;
  data?: Doc<"videos">;
}

export const createOrGetVideo = async (
  videoId: string,
  userId: string
): Promise<VideoResponse> => {
  console.log("🎬 Starting createOrGetVideo process", { videoId, userId });
  
  const user = await currentUser();
  const convex = getConvexClient();
  console.log("🔌 Initialized Convex client");

  if (!user) {
    console.error("❌ No authenticated user found");
    return { success: false, error: "User not found" };
  }
  console.log("👤 User authenticated:", user.id);

  const featureCheck = await checkFeatureUsageLimit(
    user.id,
    featureFlagEvents[FeatureFlag.VIDEO_INSIGHTS].event
  );
  console.log("🎫 Feature usage check result:", { success: featureCheck.success });

  if (!featureCheck.success) {
    console.error("❌ Feature usage limit reached:", featureCheck.error);
    return { success: false, error: featureCheck.error };
  }

  try {
    console.log("🔍 Checking for existing video in database");
    const video = await convex.query(api.videos.getVideoById, {
      userId,
      videoId,
    });
    console.log('@video:', video)

    if (!video) {
      console.log("🆕 No existing video found, fetching video details");
      const videoDetails = await getVideoDetails(videoId);
      
      if (!videoDetails) {
        console.error("❌ Failed to fetch video details from API");
        return { success: false, error: "Failed to fetch video details" };
      }
      console.log("✅ Video details fetched successfully");

      console.log("💾 Creating new video entry in database:", videoId);
      const createdVideoId = await convex.mutation(
        api.videos.createOrGetVideo,
        {
          userId,
          videoId,
          author: {
            ...videoDetails.channelDetails,
          },
          description: videoDetails.description,
          publishedAt: videoDetails.publishedAt,
          thumbnail: videoDetails.thumbnail,
          title: videoDetails.title,
          views: videoDetails.views,
        }
      );

      if (!createdVideoId) {
        console.error("❌ Failed to create video entry in database");
        return { success: false, error: "Failed to create video entry" };
      }
      console.log("✅ Video entry created successfully:", createdVideoId);

      console.log("🔍 Fetching newly created video details");
      const newVideo = await convex.query(api.videos.getVideoById, {
        userId,
        videoId,
      });

      if (!newVideo) {
        console.error("❌ Failed to fetch newly created video from database");
        return {
          success: false,
          error: "Failed to fetch video after creation",
        };
      }
      console.log("✅ New video details fetched successfully");

      console.log("📊 Tracking video insights event");
      await client.track({
        event: featureFlagEvents[FeatureFlag.VIDEO_INSIGHTS].event,
        company: {
          id: userId,
        },
        user: {
          id: userId,
        },
      });
      console.log("✅ Event tracked successfully");

      return { success: true, data: newVideo };
    } else {
      console.log("📦 Returning existing video from database");
      return { success: true, data: video };
    }
  } catch (error) {
    console.error("❌ Error in createOrGetVideo:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};
