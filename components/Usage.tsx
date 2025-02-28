"use client"
import { FeatureFlag } from "@/features/flags"
import {
    useSchematicEntitlement,
    useSchematicIsPending,
} from "@schematichq/schematic-react";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const Usage = ({ flag, title }: { flag: FeatureFlag, title: string }) => {
    const isPending = useSchematicIsPending()
    const {
        featureAllocation,
        featureUsage,
        value: isFeatureEnabled,
    } = useSchematicEntitlement(flag);
    const hasUsedAllTokens = featureAllocation && featureUsage && featureUsage >= featureAllocation

    if (isPending) return (
        <div className="bg-white shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] p-6 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-4">
                <Skeleton className="h-7 w-32" />
                <div className="px-4 py-2 rounded-lg bg-white">
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
            <div className="relative">
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="mt-2">
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    )

    if (hasUsedAllTokens) return (
        <div className="bg-white shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] p-6 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg">{title}</h2>
                <div className="px-4 py-2 rounded-lg bg-white">
                    <span className="font-medium text-red-700">{featureUsage}</span>
                    <span className="text-red-500 mx-2">/</span>
                    <span className="font-medium text-red-700">{featureAllocation}</span>
                </div>
            </div>
            <div className="relative">
                <Progress value={100} className="h-3 rounded-full bg-gray-100 [&>*]:bg-red-500" />
                <p className="text-sm mt-2 text-red-500">You have used all available tokens. Please upgrade your plan to continue using this feature.</p>
            </div>
        </div>
    )

    if (!isFeatureEnabled) return (
        <div className="bg-white shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] p-6 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg">{title}</h2>
                <div className="px-4 py-2 rounded-lg bg-white">
                    <span className="text-muted-foreground">feature disabled</span>
                </div>
            </div>
            <div className="relative">
                <Progress value={0} className="h-3 rounded-full bg-gray-100" />
                <p className="text-sm mt-2 text-gray-500">Upgrade to use this feature</p>
            </div>
        </div>
    )

    const progress = ((featureUsage || 0) / (featureAllocation || 1)) * 100

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "[&>*]:bg-red-500"
        if (progress >= 50) return "[&>*]:bg-yellow-500"
        return "[&>*]:bg-green-500"
    }

    const progressColor = getProgressColor(progress)

    return (
        <div className="bg-white p-6 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg">{title}</h2>
                <div className="px-4 py-2 rounded-lg bg-white">
                    <span className="font-medium text-muted-foreground">{featureUsage}</span>
                    <span className="text-gray-500 mx-2">/</span>
                    <span className="font-medium text-muted-foreground">{featureAllocation}</span>
                </div>
            </div>
            <div className="relative">
                <Progress value={progress} className={cn("h-3 rounded-full bg-gray-100", progressColor)} />
                {
                    progress >= 100 ? 
                        <p className="text-sm text-red-500">You have reached your usage limit</p> 
                        : progress > 85 ? 
                            <p className="text-yellow-600 text-sm">Warning: You are approaching your usage limit</p> 
                            : null
                }
            </div>
        </div>
    )
}

export default Usage
