'use client'

import dynamic from 'next/dynamic'
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from 'react'

// Dynamically import components that might use browser APIs
const YoutubeVideoForm = dynamic(() => import('@/components/YoutubeVideoForm'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-12" />
})

const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
    ssr: false,
    loading: () => <Skeleton className="w-64 h-64" />
})

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num)
}

const VideoSkeleton = () => (
    <div className="flex flex-col">
        <Skeleton className="aspect-video w-full rounded-xl mb-3" />
        <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-3 w-[40%]" />
            </div>
        </div>
    </div>
)

export default function MyVideosPage() {
    const { user } = useUser()
    const videos = useQuery(api.videos.getVideos, {
        userId: user?.id || "",
    })

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Videos</h1>
                    <div className="max-w-lg w-full">
                        <Suspense fallback={<Skeleton className="w-full h-12" />}>
                            <YoutubeVideoForm />
                        </Suspense>
                    </div>
                </div>
                <div className="h-px bg-gray-200" />
            </div>

            {/* Loading State */}
            {videos === undefined && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <VideoSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {videos && videos.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                    <Suspense fallback={<Skeleton className="w-64 h-64" />}>
                        <LottieAnimation 
                            // eslint-disable-next-line @typescript-eslint/no-require-imports
                            animationData={require('@/animations/empty.json')} 
                            className="w-64" 
                        />
                    </Suspense>
                    <h1 className="text-2xl font-bold mb-4">No videos found</h1>
                    <p className="text-gray-600">Add a YouTube video URL to get started</p>
                </div>
            )}

            {/* Videos Grid */}
            {videos && videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <Link
                            key={video.videoId}
                            href={`/video/${video.videoId}/analysis`}
                            className="group"
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
                            <div className="flex gap-3">
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
            )}
        </div>
    )
}
