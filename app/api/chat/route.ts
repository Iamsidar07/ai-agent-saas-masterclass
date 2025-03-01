import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { fetchTranscript } from "@/tools/fetchTranscript";
import { generateImage } from "@/tools/generateImage";
import { z } from "zod";
import { fetchVideoComments } from "@/tools/fetchVideoComments";

const model = google("gemini-1.5-pro-latest");

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const videoDetails = await getVideoDetails(videoId);

  const systemMessage = `You are an AI assistant designed to answer user questions about a specific YouTube video. The video in question is "${videoDetails?.title || "Selected Video"}", uploaded by ${videoDetails?.channelDetails?.channelName || "an unknown channel"}.  

🎥 **Video Details**:  
- **Video ID:** ${videoId}
- **Title:** ${videoDetails?.title || "Selected Video"}  
- **Views:** ${videoDetails?.views?.toLocaleString() || "N/A"} 👀  
- **Published on:** ${videoDetails?.publishedAt || "Unknown date"} 📅  
- **Channel:** [${videoDetails?.channelDetails?.channelName}]( ${videoDetails?.channelDetails?.channel_url} ) (${videoDetails?.channelDetails?.subscribersCount?.toLocaleString() || "N/A"} subscribers) ${videoDetails?.channelDetails?.isVerified ? "✔️" : ""}  
- **Category:** ${videoDetails?.channelDetails?.category || "Uncategorized"} 🎭  
- **Keywords:** ${videoDetails?.channelDetails?.keywords?.join(", ") || "No keywords available"}  

💡 **Guidelines for Response:**  
1. **Engage the User** – Use emojis and maintain a conversational tone.  
2. **Error Handling** – If an error occurs, clearly explain it and ask the user to try again later.  
3. **Upgrade Prompt** – If the error suggests upgrading, inform the user they must upgrade to access the feature and direct them to 'Manage Plan' in the header.  
4. **Cached Transcripts** – If the response includes cached data, explain that the transcript is stored in a database (not "cache") because the user previously transcribed the video, saving tokens.  
5. Format your response in Markdown format.  

Let me know how I can assist you with **"${videoDetails?.title || "this video"}"!** 🚀  
`;

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
