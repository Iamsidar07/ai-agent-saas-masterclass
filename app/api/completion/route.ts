import { getTranscriptions } from "@/actions/getTranscriptions";
import { getVideoDetails } from "@/actions/getVideoDetails";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const model = google("gemini-1.5-flash-8b-latest");
export async function POST(req: Request) {
  const { prompt, videoId }: { prompt: string; videoId: string } =
    await req.json();
  const videoDetails = await getVideoDetails(videoId);
  const transcription = await getTranscriptions(videoId);

  const contextPrompt = `Analyze this video:
Video is uploaded by ${videoDetails?.channelDetails.channelName}
📊 Video Details:
${videoDetails?.title ? `- Title: "${videoDetails.title}"` : ""}
${videoDetails?.views ? `- Views: ${videoDetails.views.toLocaleString()}` : ""}
${videoDetails?.publishedAt ? `- Published: ${videoDetails.publishedAt}` : ""}
${
  videoDetails?.channelDetails?.channelName
    ? `- Channel: ${videoDetails.channelDetails.channelName}`
    : ""
}

📝 Transcript:
${transcription.transcript.map((t) => `[${t.timestamp}] ${t.text}`).join("\n")}

Based on this video content, ${prompt}`;

  const result = await generateObject({
    model,
    prompt: contextPrompt,
    schema: z.object({
      suggestions: z
        .array(
          z.object({
            suggestion: z
              .string()
              .describe(
                "A suggested question to ask based on the video transcript"
              ),
            reason: z
              .string()
              .describe(
                "The reason why this suggestion is relevant to the video transcript"
              ),
          })
        )
        .min(5)
        .describe(
          "A list of 5 suggested questions to ask based on the video transcript"
        ),
    }),
  });
  console.log("/api/completion", result.object);

  return NextResponse.json(result.object);
}
