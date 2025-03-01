"use client"

import { FeatureFlag } from "@/features/flags"
import { useSchematicEntitlement } from "@schematichq/schematic-react"
import { useCallback, useEffect, useState } from "react"
import Usage from "./Usage"
import { toast } from "sonner"
import { getTranscriptions } from "@/actions/getTranscriptions"

interface TranscriptEntry {
    timestamp: string
    text: string
}

const Transcription = ({ videoId }: { videoId: string }) => {
    const [transcript, setTranscript] = useState<{
        transcript: TranscriptEntry[],
        cache: string
    } | null>(null)
    const { featureUsageExceeded } = useSchematicEntitlement(FeatureFlag.TRANSCRIPTION)

    const handleGenerateTranscription = useCallback(async (videoId: string) => {
        if (featureUsageExceeded) {
            toast.error("Transcription limit exceeded");
            return
        }
        const result = await getTranscriptions(videoId)
        setTranscript(result)
    }, [featureUsageExceeded])

    useEffect(() => { handleGenerateTranscription(videoId) }, [handleGenerateTranscription, videoId])



    return (
        <div className="flex flex-col gap-4 bg-white rounded-lg pb-0 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
            <Usage
                flag={FeatureFlag.TRANSCRIPTION}
                title="Transcription"
            />

            {
                !featureUsageExceeded ? <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto rounded-md p-4 bg-gray-50">
                    {
                        transcript ? (
                            transcript.transcript?.map((entry, index) => (<div key={index} className="flex gap-2 px-2">
                                <span className="text-muted-foreground text-sm min-w-[50px]">{entry.timestamp}</span>
                                <p className="text-sm">{entry.text}</p>
                            </div>))
                        ) : <p className="text-muted-foreground">No transcriptions available</p>
                    }


                </div> : <p className="text-red-500">You have exceeded your usage limit</p>
            }
        </div>
    )
}

export default Transcription