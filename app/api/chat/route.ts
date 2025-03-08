import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { fetchTranscript } from "@/tools/fetchTranscript";
import { generateImage } from "@/tools/generateImage";
import { z } from "zod";
import { fetchVideoComments } from "@/tools/fetchVideoComments";

const model = google("gemini-1.5-flash-8b-001");

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const videoDetails = await getVideoDetails(videoId);

  const systemMessage = `You are an AI assistant analyzing "${
    videoDetails?.title || "Selected Video"
  }". 

📊 **Video Stats**:
${videoDetails?.title ? `- "${videoDetails.title}"` : ""}
${videoDetails?.views ? `- ${videoDetails.views.toLocaleString()} views` : ""}
${videoDetails?.publishedAt ? `- Published: ${videoDetails.publishedAt}` : ""}
${
  videoDetails?.channelDetails?.channelName
    ? `- By: [${videoDetails.channelDetails.channelName}](${
        videoDetails.channelDetails.channel_url
      })${videoDetails.channelDetails.isVerified ? " ✓" : ""}`
    : ""
}
${
  videoDetails?.channelDetails?.subscribersCount
    ? `- ${videoDetails.channelDetails.subscribersCount.toLocaleString()} subscribers`
    : ""
}
${
  videoDetails?.channelDetails?.category
    ? `- Category: ${videoDetails.channelDetails.category}`
    : ""
}

💡 **Response Guidelines**:
1. Use Markdown formatting with emojis for engagement
2. For errors: Explain clearly and provide next steps
3. For premium features: Direct to 'Manage Plan' in header
4. For transcripts: Mention if using stored database version
5. Keep responses concise and actionable

<<<<Important>>>>
Here is the video Id = ${videoId}
<<<<Important>>>>

How can I help analyze this video? 🎯`;

  const result = streamText({
    model,
    system: systemMessage,
    messages,
    tools: {
      fetchTranscript,
      generateImage: generateImage(videoId, user.id),
      fetchVideoComments,
      getVideoDetails: tool({
        description: "Gets the details of a video",
        parameters: z.object({
          videoId: z
            .string()
            .describe("The ID of the video to get details for"),
        }),
        execute: async () => {
          const details = await getVideoDetails(videoId);
          return { videoDetails: details };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
