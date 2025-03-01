"use client"
import { createOrGetVideo } from "@/actions/createOrGetVideo";
import AIAgentChat from "@/components/AIAgentChat";
import DescriptionGeneration from "@/components/DescriptionGeneration";
import HookGeneration from "@/components/HookGeneration";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import TagsGeneration from "@/components/TagsGeneration";
import ThumbnailGeneration from "@/components/ThumbnailGeneration";
import TitleGeneration from "@/components/TitleGeneration";
import Transcription from "@/components/Transcription";
import Usage from "@/components/Usage";
import YoutubeVideoDetails from "@/components/YoutubeVideoDetails";
import { Doc } from "@/convex/_generated/dataModel";
import { FeatureFlag } from "@/features/flags";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AnalysePage() {
    const params = useParams()
    const videoId = params.videoId as string;
    const { user } = useUser()
    const [video, setVideo] = useState<Doc<"videos"> | null | undefined>(undefined)
    useEffect(() => {
        if (!user?.id) return;
        const fetchVideo = async () => {
            const response = await createOrGetVideo(videoId as string, user.id)
            if (!response.success) {
                console.log(response.error)
                toast.error("Error adding or getting video", { description: "please try again" })
            }
            setVideo(response.data)
        }
        fetchVideo()

    }, [user, videoId])

    const VideoTranscriptionStatus = video === undefined ? <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
        <div className="w-2 h-2 bg-gray-100 rounded-full animate-pulse" />
        <span className="w-32 h-4 bg-gray-100 animate-pulse"></span>
    </div> : !video ? <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">

        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <p className="text-sm text-amber-700">
            This is your first time analyzing this video. <br />
            <span className="font-semibold">(1 Analysis token being used)</span>
        </p>
    </div> : <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">

        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <p className="text-sm text-green-700">
            Analysis exist for this video - no additional tokens will be used.
        </p>
    </div>
    return (
        <div className="xl:container mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="order-2 lg:order-1 flex flex-col gap-4 bg-background lg:border-gray-200 p-6 ">
                    <div className="bg-white rounded-2xl shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-4 flex flex-col gap-2">
                        <Usage
                            flag={FeatureFlag.VIDEO_INSIGHTS}
                            title="Analyse Video"
                        />
                        {VideoTranscriptionStatus}
                    </div>
                    <YoutubeVideoDetails id={videoId} />
                    <ThumbnailGeneration videoId={videoId} />
                    <TitleGeneration videoId={videoId} />
                    <Transcription videoId={videoId} />
                    <SentimentAnalysis videoId={videoId} />
                    <TagsGeneration videoId={videoId} />
                    <DescriptionGeneration videoId={videoId} />
                    <HookGeneration videoId={videoId} />

                </div>
                <div className="order-1 lg:order-2 h-[550px] lg:sticky lg:top-20 md:h-[calc(100svh-6rem)]">
                    <AIAgentChat videoId={videoId} />
                </div>
            </div>
        </div>
    )
}
