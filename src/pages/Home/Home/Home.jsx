import Banner from "../Banner/Banner";
import FeaturedIssues from "../FeaturedIssues/FeaturedIssues";
import FeatureSection from "../FeatureSection/FeatureSection";
import HowItWorks from "../HowItWorks/HowItWorks";


const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <FeaturedIssues />
      <FeatureSection></FeatureSection>
      <HowItWorks></HowItWorks>
      
    </div>
  );
};

export default Home;
