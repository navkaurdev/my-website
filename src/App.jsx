import Preloader from "./Preloader.jsx";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Services from "./Services.jsx";
import Industries from "./Industries.jsx";
import About from "./About.jsx";
import Process from "./Process.jsx";
import Results from "./Results.jsx";
import Projects from "./Projects.jsx";
import Testimonials from "./Testimonials.jsx";
import Audit from "./Audit.jsx";
import FAQ from "./FAQ.jsx";
import Footer from "./Footer.jsx";

export default function App() {
  return (
    <>
      <Preloader />
      <Navbar />

      {/*
        Hero background is a YouTube reel. To use a self-hosted video instead:
          <Hero videoSrc="/reel.mp4" poster="/reel-poster.jpg" />
      */}
      <Hero youtubeId="sgiPlxAPbNA" />
      <Services />
      <Industries />
      <About />
      <Process />
      <Results />
      <Projects />
      <Testimonials />
      <Audit />
      <FAQ />
      <Footer />
    </>
  );
}
