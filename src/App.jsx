import React from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Assembly from './components/Assembly';
import Modules from './components/Modules';
import Layers from './components/Layers';
import { Install, Faq, FinalCta, Footer } from './components/Sections';
import { DownloadButton } from './components/ui';

const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div className="scroll-bar" style={{ scaleX }} aria-hidden="true" />;
};

const App = () => (
  <MotionConfig reducedMotion="user">
    <a className="sr-only" href="#how">
      Skip to content
    </a>
    <div className="bg" aria-hidden="true">
      <span className="bg-grid" />
      <span className="glow g1" />
      <span className="glow g2" />
    </div>
    <ScrollBar />
    <Header />
    <main>
      <Hero />
      <Assembly />
      <Modules />
      <Layers />
      <Install />
      <Faq />
      <FinalCta />
    </main>
    <Footer />
    {/* phones: the download stays one tap away while scrolling */}
    <DownloadButton size="sm" className="mobile-dl" />
  </MotionConfig>
);

export default App;
