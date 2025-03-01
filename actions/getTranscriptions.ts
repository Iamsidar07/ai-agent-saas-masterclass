"use server";
import { currentUser } from "@clerk/nextjs/server";
import { Innertube } from "youtubei.js";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { client as schematicClient } from "@/lib/schematic";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";

interface TranscriptEntry {
  timestamp: string;
  text: string;
}

interface TranscriptionResponse {
  transcript: TranscriptEntry[];
  cache: string;
  error?: string;
}

const formatTimeStamp = (start_ms: number): string => {
  const minutes = Math.floor(start_ms / 60000);
  const seconds = Math.floor((start_ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const fetchTranscript = async (videoId: string): Promise<TranscriptEntry[]> => {
  console.log("📥 Fetching transcript for video:", videoId);
  try {
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });
    console.log("✅ YouTube client created successfully");

    const info = await youtube.getInfo(videoId);
    console.log("📋 Video info retrieved successfully");

    const transcriptData = await info.getTranscript();
    console.log("📝 Raw transcript data retrieved");

    if (!transcriptData?.transcript?.content?.body?.initial_segments) {
      console.warn("⚠️ No transcript segments found in data");
      throw new Error("No transcript available for this video");
    }

    const transcript: TranscriptEntry[] =
      transcriptData.transcript.content.body.initial_segments.map((entry) => ({
        timestamp: formatTimeStamp(Number(entry.start_ms)),
        text: entry.snippet.text ?? "N/A",
      }));

    console.log(
      `✨ Transcript processed successfully. ${transcript.length} segments found`
    );

    if (transcript.length === 0) {
      console.warn("⚠️ Processed transcript is empty");
      throw new Error("Transcript is empty");
    }

    return transcript;
  } catch (error) {
    console.error("❌ Error fetching transcript:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transcript"
    );
  }
};

export const getTranscriptions = async (
  videoId: string
): Promise<TranscriptionResponse> => {
  console.log("🎬 Starting transcription process for video:", videoId);
  try {
    if (!videoId) {
      console.error("❌ No video ID provided");
      throw new Error("Video ID is required");
    }

    const user = await currentUser();
    if (!user?.id) {
      console.error("❌ No user authenticated");
      throw new Error("Authentication required");
    }
    console.log("👤 User authenticated:", user.id);

    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    console.log("🔌 Convex client initialized");

    // Check if transcription exists in database
    console.log("🔍 Checking for existing transcription");
    const existingTranscription = await client.query(
      api.transcrptions.getTranscriptionById,
      {
        userId: user.id,
        videoId,
      }
    );

    // Return cached transcript if available
    if (existingTranscription) {
      console.log("📦 Found existing transcription in database");
      return {
        transcript: existingTranscription.transcript,
        cache:
          "📚 Using stored transcript - This video was previously transcribed and saved in our database, saving processing time and resources.",
      };
    }

    console.log("🆕 No existing transcription found, fetching new transcript");
    // Fetch new transcript
    const transcript = await fetchTranscript(videoId);

    // Store in database
    console.log("💾 Storing new transcription in database");
    await client.mutation(api.transcrptions.createTranscription, {
      userId: user.id,
      videoId,
      transcript,
    });

    console.log("📊 Tracking transcription event");
    await schematicClient.track({
      event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    console.log("✅ Transcription process completed successfully");
    return {
      transcript,
      cache:
        "🆕 Fresh transcript - This is the first time this video has been transcribed and has been saved for future use.",
    };
  } catch (error) {
    console.error("❌ Transcription error:", error);
    return {
      transcript: [],
      cache: "An error occurred while processing the transcript.",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
