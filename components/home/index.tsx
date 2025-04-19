import Header from "./header";
import Hero from "./hero";
import Stats from "./stats";
import AboutUs from "./about-us";
import AboutDashtail from "./about-dashtail";
import ContactEnthra from "./contact";
import Footer from "./footer"

const Home = () => {
  return (
    <div className="bg-background">
      <Header />
      <Hero />
      <AboutUs />
      <Stats />
      <AboutDashtail/>
      <ContactEnthra/>
      <Footer/>
    </div>
  );
};

export default Home;
