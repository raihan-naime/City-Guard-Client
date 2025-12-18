import Banner from "../Banner/Banner";
import FeaturedIssues from "../FeaturedIssues/FeaturedIssues";
import FeatureSection from "../FeatureSection/FeatureSection";
import HowItWorks from "../HowItWorks/HowItWorks";
import PremiumBenefits from "../PremiumBenefits/PremiumBenefits";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import AnimatedSection from "../../../components/AnimatedSection/AnimatedSection";

const Home = () => {
  return (
    <div className="overflow-x-hidden space-y-20 pb-20">
      <AnimatedSection direction="down">
        <Banner />
      </AnimatedSection>

      <AnimatedSection direction="up" delay={0.2}>
        <FeaturedIssues />
      </AnimatedSection>
      
      <AnimatedSection direction="left">
        <FeatureSection />
      </AnimatedSection>
      
      <AnimatedSection direction="right">
        <PremiumBenefits />
      </AnimatedSection>
      
      <AnimatedSection direction="up">
        <HowItWorks />
      </AnimatedSection>
      
      <AnimatedSection direction="up" delay={0.1}>
        <WhyChooseUs />
      </AnimatedSection>
    </div>
  );
};

export default Home;
