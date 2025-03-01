import { getTranscriptions } from "@/actions/getTranscriptions";
import { tool } from "ai";
import z from "zod";

export const fetchTranscript = tool({
  description: "Fetches the transcript of a video in segments",
  parameters: z.object({
    videoId: z
      .string()
      .describe("The ID of the video to fetch the transcript for"),
  }),
  execute: async ({ videoId }) => {
    const transcript = await getTranscriptions(videoId);
    return {
      transcript: transcript.transcript,
      cache: transcript.cache,
    };
  },
});
