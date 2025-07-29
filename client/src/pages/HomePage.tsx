import Hero from "@/components/Hero";
import Alerts from "@/components/Alerts";
import { Helmet } from "react-helmet";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Travel Mate</title>
        <meta
          name="description"
          content="IEnhancing urban mobility through community-driven taxi information and support."
        />
      </Helmet>
      <Hero/>
      <Alerts/>
    </>
  );
};

export default HomePage;