
"use client"

import { getVideoDetails } from "@/actions/getVideoDetails"
import { Video } from "@/types"
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Eye, Clock, Calendar, Users, LucideProps, VerifiedIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

const formatNumber = (num: string | number) => {
  const n = typeof num === 'string' ? parseInt(num) : num
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(n)
}

const convertDurationInSecondsToHourMinutesAndSeconds = (durationsInSeconds: number) => {
  const hour = Math.floor(durationsInSeconds / 3600)
  const minute = Math.floor((durationsInSeconds % 3600) / 60)
  const second = durationsInSeconds % 60
  return `${hour}:${minute}:${second}`
}

const YoutubeVideoDetails = ({ id }: { id: string }) => {
  const [video, setVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true)
      const videoDetails = await getVideoDetails(id)
      setVideo(videoDetails)
      setIsLoading(false)
    }
    fetchVideoDetails()
  }, [id])

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse p-0">
        <CardContent className="p-0">
          <div className="h-48 bg-gray-200 rounded-t-xl mb-4" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!video) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Failed to load video details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden p-0">
      <CardContent className="p-0">
        {/* Thumbnail Section */}
        <a href={video.url} target="_blank">
          <div className="relative w-full aspect-video rounded-t-xl overflow-hidden">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 ease-in-out "
              priority
            />
          </div>
        </a>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-semibold mb-3">{video.title}</h1>
            <p className="text-gray-600 line-clamp-2">{video.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              icon={Eye}
              label="Views"
              value={formatNumber(video.views)}
            />
            <Stat
              icon={Calendar}
              label="Published"
              value={format(new Date(video.publishedAt), "PP")}
            />
            <Stat
              icon={Users}
              label="Subscribers"
              value={formatNumber(video.channelDetails.subscribersCount)}
            />
            <Stat
              icon={Clock}
              label="Duration"
              value={`${convertDurationInSecondsToHourMinutesAndSeconds(Number(video.channelDetails.lengthSeconds))}s`}
            />
          </div>

          {/* Channel Info */}
          <div className="flex items-center space-x-4 border-t border-b py-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={video.channelDetails.avatar}
                alt={video.channelDetails.channelName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <Link
                href={video.channelDetails.channel_url}
                target="_blank"
                className="font-semibold hover:text-primary flex items-center gap-2"
              >
                {video.channelDetails.channelName}
                {video.channelDetails.isVerified && (
                  <VerifiedIcon className="h-4 w-4 text-red-500" />
                )}
              </Link>
              <p className="text-sm text-gray-500">{video.channelDetails.username}</p>
            </div>
          </div>

          {/* Keywords/Tags */}
          {video.channelDetails.keywords && video.channelDetails.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.channelDetails.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Stat Component
const Stat = ({ icon: Icon, label, value }: { icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; label: string; value: string }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
    <Icon className="h-5 w-5 text-gray-500 mb-2" />
    <span className="text-sm font-medium">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
)

export default YoutubeVideoDetails
