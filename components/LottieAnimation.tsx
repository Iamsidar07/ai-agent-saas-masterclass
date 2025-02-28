"use client"

import { cn } from "@/lib/utils"
import Lottie from "lottie-react"

const LottieAnimation = ({ className, animationData }: { animationData: unknown, className?: string }) => {
    return (
        <div className={cn('max-w-lg grid place-items-center', className)}>
            <Lottie width={'100%'} height={'100%'} animationData={animationData} loop autoplay rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
        </div>
    )
}

export default LottieAnimation