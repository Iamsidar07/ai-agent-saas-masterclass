"use client"

import { cn } from "@/lib/utils"
import Lottie from "lottie-react"
import { Suspense } from "react"

const LottieAnimation = ({ className, animationData }: { animationData: unknown, className?: string }) => {
    return (
        <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg mb-8" />}>
            <div className={cn('max-w-lg grid place-items-center', className)}>
                <Lottie width={'100%'} height={'100%'} animationData={animationData} loop autoplay rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
            </div>
        </Suspense>
    )
}

export default LottieAnimation