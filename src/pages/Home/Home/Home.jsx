
import Banner from "../Banner/Banner";
import FeaturedIssues from "../FeaturedIssues/FeaturedIssues";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <FeaturedIssues />
      
      <div className="my-20 text-center bg-base-200 py-16 px-4">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <ul className="steps steps-vertical lg:steps-horizontal w-full max-w-4xl mx-auto">
          <li className="step step-primary" data-content="1">
            Report Issue
          </li>
          <li className="step step-primary" data-content="2">
            Admin Reviews
          </li>
          <li className="step step-primary" data-content="3">
            Staff Assigned
          </li>
          <li className="step step-primary" data-content="✓">
            Issue Resolved
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
