"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import YoutubeVideoForm from "@/components/YoutubeVideoForm"

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num)
}

export default function MyVideosPage() {
    const { user } = useUser()
    const videos = useQuery(api.videos.getVideos, {
        userId: user?.id || "",
    })

    // if (videos?.length) {
    //     return (
    //         <div className="container mx-auto px-4 md:px-0 py-8">
    //             <div className="flex flex-col items-center justify-center min-h-[60vh]">
    //                 <div className="text-center">
    //                     <h1 className="text-2xl font-bold mb-4">No videos found</h1>
    //                     <p className="text-gray-600">Add a YouTube video URL to get started</p>
    //                     {/* <div className="mt-6 max-w-lg mx-auto">
    //                         <YoutubeVideoForm />
    //                     </div> */}
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Videos</h1>
                    <div className="max-w-lg w-full">
                        <YoutubeVideoForm />
                    </div>
                </div>
                <div className="h-px bg-gray-200" />
            </div>

            {
                !videos?.length &&
                <div className="flex flex-col items-center justify-center min-h-[40vh]">

                    <h1 className="text-2xl font-bold mb-4">No videos found</h1>
                    <p className="text-center text-gray-600">Add a YouTube video URL to get started</p>
                </div>
            }

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos?.map((video) => (
                    <Link
                        key={video.videoId}
                        href={`/video/${video.videoId}/analysis`}
                        className="group shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] rounded-2xl"
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                priority
                            />
                        </div>

                        {/* Video Info */}
                        <div className="flex gap-3 px-4 pb-4">
                            {/* Channel Avatar */}
                            <div className="flex-shrink-0">
                                <div className="relative h-9 w-9 rounded-full overflow-hidden">
                                    <Image
                                        src={video.author.avatar}
                                        alt={video.author.channelName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Title and Meta */}
                            <div className="flex-1">
                                <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600">
                                    {video.title}
                                </h3>
                                <div className="text-sm text-gray-600">
                                    <p>{video.author.channelName}</p>
                                    <div className="flex items-center gap-1">
                                        <span>{formatNumber(video.views)} views</span>
                                        <span>•</span>
                                        <span>{format(new Date(video.publishedAt), "MMM d, yyyy")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
