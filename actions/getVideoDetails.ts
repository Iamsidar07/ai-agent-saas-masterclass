"use server";

import { Video } from "@/types";
import ytdl from "ytdl-core";

export const getVideoDetails = async (id: string): Promise<Video | null> => {
  if (!id) return null;
  try {
    const { videoDetails } = await ytdl.getBasicInfo(id);
    if (!videoDetails) throw new Error("Failed to fetch video details");
    const video: Video = {
      title: videoDetails.title,
      url: videoDetails.video_url,
      thumbnail:
        videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
      description: videoDetails.description || "",
      views: videoDetails.viewCount,
      publishedAt: videoDetails.uploadDate,
      channelDetails: {
        subscribersCount: videoDetails.author.subscriber_count || 0,
        channelName: videoDetails.author.name,
        avatar:
          videoDetails.author.thumbnails?.[
            videoDetails.author.thumbnails.length - 1
          ].url ||
          "https://yt3.ggpht.com/R5lIbdDAdEAUxkLiEaaARvFVXRTTXfGi1aW5ZlL5ag7TyjXsQCI66npOEu0IwTU7UiwOaOeMGw0=s176-c-k-c0x00ffffff-no-rj",
        channel_url: videoDetails.author.channel_url,
        username: videoDetails.author.user || "",
        user_url: videoDetails.author.user_url || "",
        isVerified: videoDetails.author.verified,
        keywords: videoDetails.keywords || [""],
        category: videoDetails.category,
        lengthSeconds: videoDetails.lengthSeconds,
      },
    };
    return video;
  } catch (error: unknown) {
    console.log("@getVideoDetails error", error);
    return null;
  }
};
