import { tool } from "ai";
import { z } from "zod";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorChannelUrl: string;
  authorProfileImageUrl: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
}

export const fetchVideoComments = tool({
  description: "Fetches up to 50 most relevant comments from a YouTube video",
  parameters: z.object({
    videoId: z.string().describe("The ID of the video to fetch comments for"),
  }),
  execute: async ({ videoId }) => {
    console.log("📝 Fetching comments for video", { videoId });

    try {
      const response = await youtube.commentThreads.list({
        part: ["snippet", "replies"],
        videoId: videoId,
        maxResults: 50,
        order: "relevance", // Can be: 'time' | 'relevance'
        textFormat: "plainText",
      });

      if (!response.data.items) {
        console.log("⚠️ No comments found for video");
        return {
          success: true,
          comments: [],
          totalCount: 0,
        };
      }

      const comments: Comment[] = response.data.items.map((item) => {
        const comment = item.snippet?.topLevelComment?.snippet;
        return {
          id: item.id || "",
          text: comment?.textDisplay || "",
          authorName: comment?.authorDisplayName || "",
          authorChannelUrl: comment?.authorChannelUrl || "",
          authorProfileImageUrl: comment?.authorProfileImageUrl || "",
          likeCount: comment?.likeCount || 0,
          publishedAt: comment?.publishedAt || "",
          updatedAt: comment?.updatedAt || "",
        };
      });

      console.log(`✅ Successfully fetched ${comments.length} comments`);

      return {
        success: true,
        comments,
        totalCount: comments.length,
      };

    } catch (error) {
      console.error("❌ Error fetching comments:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch comments",
        comments: [],
        totalCount: 0,
      };
    }
  },
});