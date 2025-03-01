import { handleImageGeneration } from "@/actions/handleImageGeneration";
import { FeatureFlag } from "@/features/flags";
import { client } from "@/lib/schematic";
import { tool } from "ai";
import { z } from "zod";

export const generateImage = (videoId: string, userId: string) =>
  tool({
    description: "Generates an image based on a prompt",
    parameters: z.object({
      prompt: z.string().describe("The prompt to generate the image from"),
      videoId: z.string().describe("The youtube video id"),
    }),
    execute: async ({ prompt }) => {
      const isImageGenerationEnabled = await client.checkFlag(
        {
          company: {
            id: userId,
          },
          user: {
            id: userId,
          },
        },
        FeatureFlag.THUMBNAIL_GENERATION
      );
      if (!isImageGenerationEnabled) {
        return {
          error: "Image Generation is not enabled, Please upgrade your plan",
        };
      }

      const image = await handleImageGeneration(prompt, videoId)
      return {image}
    },
  });
