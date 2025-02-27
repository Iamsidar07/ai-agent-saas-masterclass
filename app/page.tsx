import FeaturesGrid from "@/components/FeaturesGrid";
import Hero from "@/components/Hero";
import { SquaresPattern } from "@/components/SquarePattern";
import StepsSection from "@/components/StepsSection";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturesGrid />
      <StepsSection />
      <section className="relative py-24 px-6 text-center">
        <SquaresPattern/>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Meet Your AI Content Agent?
          </h2>
          <p className="text-lg mt-2">
            Join creators leveraging AI to unlock content insights
          </p>
          <Button className="mt-8 font-cal" size={'lg'}>Get Started for Free</Button>
        </div>
      </section>
    </div>
  );
}
