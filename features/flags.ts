export enum FeatureFlag {
  TRANSCRIPTION = "transcriptions",
  VIDEO_INSIGHTS = "video-insights",
  TITLE_GENERATION = "title-generation",
  THUMBNAIL_GENERATION = "thumbnail-generation",
  SCRIPT_GENERATION = "script-generation",
}

export const featureFlagEvents: Record<FeatureFlag, { event: string }> = {
  [FeatureFlag.VIDEO_INSIGHTS]: {
    event: "analyse-video",
  },
  [FeatureFlag.TITLE_GENERATION]: {
    event: "generate-title",
  },
  [FeatureFlag.THUMBNAIL_GENERATION]: {
    event: "generate-thumbnail",
  },
  [FeatureFlag.SCRIPT_GENERATION]: {
    event: "generate-script",
  },
  [FeatureFlag.TRANSCRIPTION]: {
    event: "",
  },
};
