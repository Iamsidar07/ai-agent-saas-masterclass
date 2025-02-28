import { cn } from "@/lib/utils";
import { Video, Brain, MessageCircle } from "lucide-react";
import GradientText from "./GradientText";

const steps = [
  {
    title: "Connect Your Content",
    description: "Share your YouTube video URL and let your agent get to work.",
    icon: Video,
    bg: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
  },
  {
    title: "AI Agent Analysis",
    description: "Your personal agent analyzes every aspect of your content.",
    icon: Brain,
    bg: "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
  },
  {
    title: "Receive Intelligence",
    description: "Get actionable insights and strategic recommendations.",
    icon: MessageCircle,
    bg: "bg-gradient-to-br from-green-500 to-green-700 text-white",
  },
];


export default function StepsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-center mb-12">
        Meet Your AI Agent in <GradientText>3 Simple Steps</GradientText>
      </h2>
      <div className="relative flex sm:flex-row flex-col items-center gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center w-full max-w-2xl text-center"
          >
            <div className="bg-white rounded-lg p-6">
              <div className={cn("w-16 h-16 flex items-center justify-center rounded-full shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] mx-auto", step.bg)}>
                <step.icon
                  className={`h-10 w-10`}
                />
              </div>
              <h3 className="text-lg font-semibold mt-4">{index + 1}. {step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
