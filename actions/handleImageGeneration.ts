"use server"

import { api } from "@/convex/_generated/api"
import { FeatureFlag, featureFlagEvents } from "@/features/flags"
import { getConvexClient } from "@/lib/convex"
import { client } from "@/lib/schematic"
import { currentUser } from "@clerk/nextjs/server"

export const handleImageGeneration = async (prompt: string, videoId: string) => {
    console.log("🎨 Starting image generation process", { prompt, videoId });
    
    try {
        const user = await currentUser()
        if(!user?.id) {
            console.error("❌ No authenticated user found");
            throw new Error("User not found")
        }
        console.log("👤 User authenticated:", user.id);

        const convexClient = getConvexClient()
        console.log("🔌 Initialized Convex client");

        console.log("📝 Preparing image generation request");
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('output_format', 'webp');
        formData.append('width', '1792');
        formData.append('height', '1024');

        console.log("🚀 Sending request to Stability AI");
        const response = await fetch(
            'https://api.stability.ai/v2beta/stable-image/generate/ultra',
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
                    'Accept': 'image/*'
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Stability AI API error:", {
                status: response.status,
                error: errorText
            });
            throw new Error(`Stability AI Error: ${response.status}: ${errorText}`);
        }
        console.log("✅ Received successful response from Stability AI");

        const arrayBuffer = await response.arrayBuffer();
        if(!arrayBuffer) {
            console.error("❌ Failed to get array buffer from response");
            throw new Error("Failed to generate image")
        }
        console.log("📦 Successfully converted response to array buffer");

        console.log("🔑 Requesting Convex upload URL");
        const uploadUrl = await convexClient.mutation(api.images.generateUploadUrl);
        console.log("✅ Received upload URL from Convex");

        console.log("📤 Uploading image to Convex storage");
        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: arrayBuffer,
            headers: {
                "Content-Type": "image/webp"
            }
        });

        if (!uploadResponse.ok) {
            console.error("❌ Failed to upload to Convex storage:", {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText
            });
            throw new Error("Failed to upload image to storage");
        }
        console.log("✅ Successfully uploaded to Convex storage");

        console.log("📝 Getting storage ID from upload response");
        const { storageId } = await uploadResponse.json();
        console.log("📍 Storage ID received:", storageId);

        console.log("💾 Storing image metadata in Convex");
        await convexClient.mutation(api.images.storeImage, {
            storageId,
            videoId,
            userId: user.id
        });
        console.log("✅ Image metadata stored successfully");

        console.log("🔄 Converting image to base64 for immediate display");
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const imageUrl = `data:image/webp;base64,${base64Image}`;

        console.log("📊 Tracking image generation event");
        await client.track({
            event: featureFlagEvents[FeatureFlag.THUMBNAIL_GENERATION].event,
            company: {
                id: user.id,
            },
            user: {
                id: user.id,
            },
        });
        console.log("✅ Event tracked successfully");

        console.log("🎉 Image generation process completed successfully");
        return { success: true, imageUrl };

    } catch (error) {
        console.error("❌ Image generation error:", error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to generate image'
        };
    }
}
