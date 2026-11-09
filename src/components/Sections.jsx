import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { INSTALL, FAQ, KEYWORDS, SITE, NAV } from '../content';
import { DownloadButton, Icon, Logo, Reveal } from './ui';

const InstallStep = ({ s, i, progress }) => {
  const at = (i + 0.5) / INSTALL.length;
  const on = useTransform(progress, [at - 0.12, at], [0, 1]);
  const bg = useTransform(on, [0, 1], ['rgba(255,255,255,0.7)', 'rgba(34,135,143,1)']);
  const color = useTransform(on, [0, 1], ['#22878F', '#ffffff']);
  return (
    <li className="ins-step">
      <motion.span className="ins-node" style={{ background: bg, color }}>
        {i + 1}
      </motion.span>
      <motion.div style={{ opacity: useTransform(on, [0, 1], [0.45, 1]) }}>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </motion.div>
    </li>
  );
};

/** Install steps on a line that fills as you scroll; each node lights up when the line reaches it. */
export const Install = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  return (
    <section className="section install" id="install" aria-labelledby="install-title">
      <div className="wrap install-grid">
        <div>
          <Reveal className="kicker">Install</Reveal>
          <Reveal as="h2" id="install-title" i={1}>
            Up and talking in a minute.
          </Reveal>
          <Reveal as="p" className="section-lead" i={2}>
            TalkLink is a direct download for Android, not on the Play Store yet.
          </Reveal>
          <Reveal className="dl-card" i={3}>
            <span className="dl-ico">
              <Icon name="android" size={26} />
            </span>
            <div>
              <b>TalkLink.apk</b>
              <small>
                v{SITE.apkVersion} · {SITE.apkSize} · {SITE.minAndroid}
              </small>
            </div>
            <DownloadButton size="sm" label="Download" />
          </Reveal>
        </div>
        <ol className="ins-line" ref={ref}>
          <span className="ins-track" aria-hidden="true">
            <motion.span style={{ scaleY: scrollYProgress }} />
          </span>
          {INSTALL.map((s, i) => (
            <InstallStep key={s.title} s={s} i={i} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export const Faq = () => (
  <section className="section" id="faq" aria-labelledby="faq-title">
    <div className="wrap faq-wrap">
      <div>
        <Reveal className="kicker">FAQ</Reveal>
        <Reveal as="h2" id="faq-title" i={1}>
          Quick answers.
        </Reveal>
      </div>
      <div className="faq">
        {FAQ.map((f, i) => (
          <Reveal as="details" i={i % 3} key={f.q}>
            <summary>
              {f.q}
              <span className="faq-plus">
                <Icon name="plus" size={14} stroke={2.6} />
              </span>
            </summary>
            <p className="faq-a">{f.a}</p>
          </Reveal>
        ))}
      </div>
      {/* Google FAQ rich results - same text as above */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  </section>
);

export const FinalCta = () => (
  <section className="section" aria-labelledby="cta-title">
    <div className="wrap">
      <Reveal className="cta-card">
        <div className="cta-grid" aria-hidden="true" />
        <motion.div
          className="cta-logo"
          initial={{ rotate: -12, scale: 0.8 }}
          whileInView={{ rotate: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <Logo size={64} />
        </motion.div>
        <h2 id="cta-title">Someone new is one tap away.</h2>
        <p>Free download. 100 credits to start.</p>
        <DownloadButton />
      </Reveal>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="footer-row">
        <a className="brand" href="#top">
          <Logo size={30} />
          TalkLink
        </a>
        <nav className="footer-links" aria-label="Footer">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.label}
            </a>
          ))}
          {SITE.privacyUrl ? (
            <a href={SITE.privacyUrl} rel="noopener">
              Privacy Policy
            </a>
          ) : null}
          {SITE.termsUrl ? (
            <a href={SITE.termsUrl} rel="noopener">
              Terms of Use
            </a>
          ) : null}
          {SITE.supportEmail ? <a href={`mailto:${SITE.supportEmail}`}>Support</a> : null}
        </nav>
      </div>
      <p className="footer-keywords">
        TalkLink: {KEYWORDS.join(' · ')}. For adults 18+. Credits have no cash value. © {new Date().getFullYear()} TalkLink.
      </p>
    </div>
  </footer>
);
