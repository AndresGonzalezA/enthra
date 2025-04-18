"use client";
import Header from "./header";
import Hero from "./hero";
import Stats from "./stats";
import AboutUs from "./about-us";
import ProjectTools from "./project-tools";
import PricingPlan from "./pricing-plan";
import Contact from "./contact";
import Footer from "./footer";
import { useMounted } from "@/hooks/use-mounted";
import LayoutLoader from "@/components/layout-loader";

const LandingPageView = () => {
  const mounted = useMounted();
  if (!mounted) {
    return <LayoutLoader />;
  }
  return (
    <div className="bg-background">
      <Header />
      <Hero />
      <Stats />
      <AboutUs />
      <ProjectTools />
      <PricingPlan />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPageView;
