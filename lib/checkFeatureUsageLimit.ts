import { featureFlagEvents } from "@/features/flags";
import { client } from "./schematic";

export const checkFeatureUsageLimit = async (
  userId: string,
  eventSubType: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const entitlements = await client.entitlements.getFeatureUsageByCompany({
      keys: {
        id: userId,
      },
    });

    const feature = entitlements.data.features.find(
      (entitlement) => entitlement.feature?.eventSubtype === eventSubType
    );
    if (!feature) {
      return {
        success: false,
        error:
          "This feature is not avaiable in your current plan please upgrade",
      };
    }
    const { usage, allocation } = feature;
    if (usage === undefined || allocation === undefined) {
      return { success: false, error: "Connect to the support team" };
    }

    const hasExceededUsageLimit = usage >= allocation;
    if (hasExceededUsageLimit) {
      const featureName =
        Object.entries(featureFlagEvents).find(
          ([, value]) => value.event === eventSubType
        )?.[0] || eventSubType;
      return {
        success: false,
        error: `You have reached your ${featureName} limit. Please upgrade your plan to continue using this feature.`,
      };
    }
    return { success: true };
  } catch (error) {
    console.log("Error checking feature usage limit", error);
    return {
      success: false,
      error: "Error checking feature usage limit",
    };
  }
};
