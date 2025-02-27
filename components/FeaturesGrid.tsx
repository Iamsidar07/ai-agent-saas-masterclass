import { Card, CardContent } from "@/components/ui/card";
import { Brain, Image, MessageCircle, Film, PenTool, Bot } from "lucide-react";

const features = [
  {
    title: "AI Analysis",
    description:
      "Get deep insights into your video content with our advanced AI analysis. Understand viewer engagement and content quality.",
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    className: "col-span-2 md:col-span-1",
  },
  {
    title: "Smart Transcription",
    description:
      "Get accurate transcriptions of your videos. Perfect for creating subtitles, blog posts, or repurposing content.",
    icon: <MessageCircle className="h-6 w-6 text-green-500" />,
    className: "col-span-2 md:col-span-2",
  },
  {
    title: "Thumbnail Generation",
    description:
      "Generate eye-catching thumbnails using AI. Boost your click-through rates with compelling visuals.",
    icon: <Image className="h-6 w-6 text-purple-500" />,
    className: "col-span-2 md:col-span-1",
  },
  {
    title: "Title Generation",
    description:
      "Create attention-grabbing, SEO-optimized titles for your videos using AI. Maximize views with audience-resonating titles.",
    icon: <PenTool className="h-6 w-6 text-yellow-500" />,
    className: "col-span-2 md:col-span-1",
  },
  {
    title: "Shot Script",
    description:
      "Get detailed, step-by-step instructions to recreate viral videos. Learn shooting techniques, angles, and editing tips.",
    icon: <Film className="h-6 w-6 text-red-500" />,
    className: "col-span-2 md:col-span-1",
  },
  {
    title: "Discuss with Your AI Agent",
    description:
      "Engage in deep conversations about your content strategy, brainstorm ideas, and unlock creative possibilities.",
    icon: <Bot className="h-6 w-6 text-orange-500" />,
    className: "col-span-2 md:col-span-2",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Powerful Features for Content Creators
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className={`${feature.className} border-0 ring-[1px] ring-gray-100`}>
            <CardContent className="flex flex-col items-start gap-2">
              {feature.icon}
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
