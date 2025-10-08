import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
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
      <Hero />
      
    
    </>
  );
};

export default HomePage;