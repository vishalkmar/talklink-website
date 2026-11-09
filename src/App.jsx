import React, { Suspense, lazy, useEffect, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import { Story, Faq, FinalCta, Footer } from './components/Sections';
import { DownloadButton } from './components/ui';

// The flying 3D phone: browser only, after first paint (three.js is its own chunk).
const StoryScene = lazy(() => import('./three/StoryScene'));

const canUseWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
};

const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div className="scroll-bar" style={{ scaleX }} aria-hidden="true" />;
};

const App = () => {
  const [scene, setScene] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ok = !reduce && canUseWebGL();
    document.documentElement.classList.add(ok ? 'with-3d' : 'no-3d');
    setScene(ok);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="sr-only" href="#talk">
        Skip to content
      </a>
      <div className="bg-mesh" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="blob b4" />
      </div>
      {scene ? (
        <Suspense fallback={null}>
          <StoryScene onReady={() => document.documentElement.classList.add('scene-ready')} />
        </Suspense>
      ) : null}
      <ScrollBar />
      <Header />
      <main>
        <Hero />
        <Story />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      {/* phones: the download stays one tap away while scrolling */}
      <DownloadButton size="sm" className="mobile-dl" />
    </MotionConfig>
  );
};

export default App;
