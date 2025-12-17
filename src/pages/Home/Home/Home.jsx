import Banner from "../Banner/Banner";
import FeaturedIssues from "../FeaturedIssues/FeaturedIssues";
import FeatureSection from "../FeatureSection/FeatureSection";
import HowItWorks from "../HowItWorks/HowItWorks";
import PremiumBenefits from "../PremiumBenefits/PremiumBenefits";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";


const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <FeaturedIssues />
      <FeatureSection></FeatureSection>
      <PremiumBenefits></PremiumBenefits>
      <HowItWorks></HowItWorks>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
};

export default Home;
