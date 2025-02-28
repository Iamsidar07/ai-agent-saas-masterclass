"use client"

import { useUser } from "@clerk/nextjs"
import Usage from "./Usage"
import { FeatureFlag } from "@/features/flags"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api"

const ThumbnailGeneration = ({ videoId }: { videoId: string }) => {
    const { user } = useUser()
    const images = useQuery(api.images.getImages, {
        userId: user?.id || "",
        videoId
    })
    return (
        <div className="rounded-lg flex flex-col gap-4 p-4 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
            <div className="min-w-52">
                <Usage
                    flag={FeatureFlag.THUMBNAIL_GENERATION}
                    title="Thumbnail Generation"
                />
            </div>
            {
                images && images.length > 0 && <div className={cn("flex items-center gap-4 overflow-x-auto", images?.length && "mt-4")}>
                    {
                        images.map((image) => image.url && <div key={image.url} className="flex-none w-[200px] h-[110px] rounded-lg overflow-auto"></div>)
                    }

                </div>
            }
            {
                !images?.length && <div className="text-center px-4 py-8 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
                    <p className="text-muted-foreground font-cal"> No thumbnails have been generated yet </p>
                    <p className="text-muted-foreground text-sm mt-1 ">Generate thumbnais to see them appear here</p>

                </div>
            }

        </div>
    )
}

export default ThumbnailGeneration