"use client"

import { useUser } from "@clerk/nextjs"
import Usage from "./Usage"
import { FeatureFlag } from "@/features/flags"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


const DescriptionGeneration = ({ videoId }: { videoId: string }) => {
    const { user } = useUser()
    const titles = useQuery(api.titles.getTitles, {
        userId: user?.id || "",
        videoId
    })
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard")
    }
    return (
        <div className="rounded-lg flex flex-col gap-4 p-4 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
            <div className="min-w-52">
                <Usage
                    flag={FeatureFlag.GENERATE_DESCRIPTION}
                    title="Description Generation"
                />
            </div>
            <div className={cn("flex flex-col gap-2 max-h-[2800x] overflow-y-auto", titles?.length && "mt-4")}>
                {
                    titles?.map((title) => title && <div key={title._id} className="group relative p-4 rounded bg-red-50 border border-red-50 hover:border-red-100 hover:bg-red-100 transition-all duration-200">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm leading-relaxed">{title.title}</p>
                            <button onClick={() => copyToClipboard(title.title)} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-1.5 cursor-pointer hover:text-red-800" title="Copy to clipboard">
                                <Copy className="w-4 h-4 text-red-700" />

                            </button>
                        </div>

                    </div>)
                }

            </div>
            {
                !titles?.length && <div className="text-center px-4 py-8 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
                    <p className="text-muted-foreground font-cal"> No description have been generated yet </p>
                    <p className="text-muted-foreground text-sm mt-1 ">Generate description to see them appear here</p>

                </div>
            }

        </div>
    )
}

export default DescriptionGeneration