export enum FeatureFlag {
  TRANSCRIPTION = "transcriptions",
  VIDEO_INSIGHTS = "video-insights",
  TITLE_GENERATION = "title-generation",
  THUMBNAIL_GENERATION = "thumbnail-generation",
  SCRIPT_GENERATION = "script-generation",
  SENTIMENT_ANALYSIS = "sentiment-analysis-of-comments",
  GENERATE_TAGS = "generate-tags",
  GENERATE_DESCRIPTION = "generate-description",
  GENERATE_HOOKS="video-hook-generation"
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
  [FeatureFlag.SENTIMENT_ANALYSIS]: {
    event: "sentiment-analysis-of-comments",
  },
  [FeatureFlag.TRANSCRIPTION]: {
    event: "transcription",
  },
  [FeatureFlag.GENERATE_TAGS]: {
    event: "generate-tags",
  },
  [FeatureFlag.GENERATE_DESCRIPTION]: {
    event: "generate-description",
  },
  [FeatureFlag.GENERATE_HOOKS]: {
    event: "generate-hook"
  }
};
