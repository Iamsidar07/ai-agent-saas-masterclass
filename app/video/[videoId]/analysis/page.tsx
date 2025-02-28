import Usage from "@/components/Usage";
import YoutubeVideoDetails from "@/components/YoutubeVideoDetails";
import { FeatureFlag } from "@/features/flags";

export default async function AnalysePage({ params }: { params: Promise<{ videoId: string }> }) {
    const { videoId } = await params;
    return (
        <div className="xl:container mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="order-2 lg:order-1 flex flex-col gap-4 bg-background lg:border-gray-200 p-6 ">
                    <div className="bg-white rounded-2xl border p-4">
                        <Usage
                            flag={FeatureFlag.VIDEO_INSIGHTS}
                            title="Analyse Video"
                        />
                    </div>
                    <YoutubeVideoDetails id={videoId} />

                </div>
                <div className="order-1 lg:order-2 h-[550px] lg:sticky lg:top-20 md:h-[calc(100svh-6rem)]">chat</div>
            </div>
        </div>
    )
}
