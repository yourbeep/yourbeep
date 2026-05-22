import LandingTopbar from "../components/LandingTopbar";
import LandingCTA from "../components/LandingCTA";
import LandingFAQ from "../components/LandingFAQ";
import LandingFooter from "../components/LandingFooter";
import CoursesPreviewSection from "../components/CoursesPreviewSection";
import ExperienceSection from "../components/ExperienceSection";
import FounderSection from "../components/FounderSection";
import HeroSection from "../components/HeroSection";
import StickyNarrativeSection from "../components/StickyNarrativeSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PhilosophySection from "../components/Philosophysection";
import PersonaSection from "../components/PersonaSection";
import VideoMarqueeSection from "../components/Videomarqueesection";

const LandingPage = () => {
  return (
    <>
      <LandingTopbar />
      <HeroSection />
      {/* <ReasonsSection /> */}
      <PhilosophySection />
      <FounderSection />
      <CoursesPreviewSection />
      {/* <QuoteSection /> */}
      <StickyNarrativeSection />
      <ExperienceSection />
      <VideoMarqueeSection />
      {/* <FeaturedArticleSection /> */}
      {/* <RecentReflectionsSection /> */}
      <PersonaSection />
      <TestimonialsSection />
      <section id="faq" className="bg-white px-4 py-12 md:px-6 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <LandingCTA />
          <LandingFAQ />
        </div>
      </section>
      <LandingFooter />
    </>
  );
};

export default LandingPage;
