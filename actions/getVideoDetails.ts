"use server";

import { Video } from "@/types";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export const getVideoDetails = async (id: string): Promise<Video | null> => {
  if (!id) return null;
  try {
    // Get video details
    const videoResponse = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [id],
    });

    const videoData = videoResponse.data.items?.[0];
    if (!videoData) throw new Error("Failed to fetch video details");

    // Get channel details
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "statistics"],
      id: [videoData.snippet?.channelId || ""],
    });

    const channelData = channelResponse.data.items?.[0];
    if (!channelData) throw new Error("Failed to fetch channel details");

    // Convert ISO 8601 duration to seconds
    const getDurationInSeconds = (duration: string): string => {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = (match?.[1] || "").replace("H", "") || "0";
      const minutes = (match?.[2] || "").replace("M", "") || "0";
      const seconds = (match?.[3] || "").replace("S", "") || "0";
      
      return String(
        parseInt(hours) * 3600 + 
        parseInt(minutes) * 60 + 
        parseInt(seconds)
      );
    };

    const video: Video = {
      title: videoData.snippet?.title || "",
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: videoData.snippet?.thumbnails?.maxres?.url || 
                videoData.snippet?.thumbnails?.high?.url || 
                videoData.snippet?.thumbnails?.default?.url || "",
      description: videoData.snippet?.description || "",
      views: parseInt(videoData.statistics?.viewCount || "0"),
      publishedAt: videoData.snippet?.publishedAt || "",
      channelDetails: {
        subscribersCount: parseInt(channelData.statistics?.subscriberCount || "0"),
        channelName: channelData.snippet?.title || "",
        avatar: channelData.snippet?.thumbnails?.high?.url || 
                channelData.snippet?.thumbnails?.default?.url || 
                "https://yt3.ggpht.com/R5lIbdDAdEAUxkLiEaaARvFVXRTTXfGi1aW5ZlL5ag7TyjXsQCI66npOEu0IwTU7UiwOaOeMGw0=s176-c-k-c0x00ffffff-no-rj",
        channel_url: `https://www.youtube.com/channel/${videoData.snippet?.channelId}`,
        username: channelData.snippet?.customUrl || "",
        user_url: `https://www.youtube.com/${channelData.snippet?.customUrl || ""}`,
        isVerified: false, // YouTube API doesn't provide verification status
        keywords: videoData.snippet?.tags || [""],
        category: videoData.snippet?.categoryId || "",
        lengthSeconds: getDurationInSeconds(videoData.contentDetails?.duration || "PT0S"),
      },
    };

    return video;
  } catch (error: unknown) {
    console.log("@getVideoDetails error", error);
    return null;
  }
};
