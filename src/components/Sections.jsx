import React from 'react';
import { motion } from 'framer-motion';
import { STORY, STEPS, INSTALL_STEPS, FAQ, KEYWORDS, SITE, NAV } from '../content';
import { DownloadButton, Icon, Icon3D, Logo, Reveal, WordsReveal } from './ui';
import PhoneMock from './PhoneMock';

const TONES = ['teal', 'gold', 'purple', 'blue', 'flame', 'green', 'pink'];

const IconRow = ({ icon, tone, title, text, i }) => (
  <Reveal as="li" className="icon-row" i={i}>
    <Icon3D name={icon} tone={tone} size={58} />
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </Reveal>
);

const InstallBlock = () => (
  <>
    <ol className="steps">
      {STEPS.map((s, i) => (
        <Reveal as="li" className="glass step" i={i} key={s.n}>
          <span className="step-n">{s.n}</span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
    <Reveal className="install-guide" i={1}>
      <h3>
        <Icon name="android" size={22} /> Installing the APK
      </h3>
      <ol>
        {INSTALL_STEPS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <DownloadButton />
    </Reveal>
  </>
);

const SCREEN_LABEL = {
  connect: 'TalkLink finding someone to talk to, then a match',
  incall: 'TalkLink in a call with mute, speaker and chat buttons',
  chat: 'TalkLink chat with a voice note and a view-once message',
  status: 'TalkLink status viewer with progress bars and a download button',
  goals: 'TalkLink goals screen with a 7 day streak and daily goals',
  privacy: 'TalkLink privacy settings: who can call me and the private number',
  install: 'Installing the TalkLink app',
};

const Chapter = ({ ch, n }) => (
  <section className={`story story-${ch.textSide}`} id={ch.id} aria-labelledby={`${ch.id}-title`}>
    <div className="wrap story-grid">
      <div className="story-text">
        <Reveal className="chapter-tag">
          <span className="chapter-n">{String(n).padStart(2, '0')}</span>
          <span className="kicker">{ch.kicker}</span>
        </Reveal>
        <WordsReveal id={`${ch.id}-title`} text={ch.title} className="story-title" />
        <Reveal as="p" className="story-lead" i={1}>
          {ch.lead}
        </Reveal>
        {ch.items.length ? (
          <ul className="icon-list">
            {ch.items.map((f, i) => (
              <IconRow key={f.title} icon={f.icon} tone={TONES[(n + i) % TONES.length]} title={f.title} text={f.text} i={i} />
            ))}
          </ul>
        ) : null}
        {ch.id === 'install' ? <InstallBlock /> : null}
      </div>
      <div className="phone-anchor story-anchor" data-phone data-screen={ch.screen} data-prop={ch.prop} data-rot={ch.rot}>
        {/* without WebGL the same screen is drawn flat */}
        <div className="stage-fallback">
          <PhoneMock screen={ch.screen} label={SCREEN_LABEL[ch.screen]} />
        </div>
      </div>
    </div>
  </section>
);

export const Story = () => (
  <div className="story-wrap">
    {STORY.map((ch, i) => (
      <Chapter ch={ch} n={i + 1} key={ch.id} />
    ))}
  </div>
);

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export const Faq = () => (
  <section className="section" id="faq" aria-labelledby="faq-title">
    <div className="wrap">
      <div className="section-head center">
        <Reveal className="kicker">FAQ</Reveal>
        <WordsReveal id="faq-title" text="Questions, answered." />
      </div>
      <div className="faq">
        {FAQ.map((f, i) => (
          <Reveal as="details" className="glass" i={i % 4} key={f.q}>
            <summary>
              {f.q}
              <span className="faq-plus">
                <Icon name="plus" size={16} stroke={2.6} />
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
        <svg className="cta-rings" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="400"
              cy="200"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
              style={{ transformOrigin: '400px 200px' }}
            />
          ))}
        </svg>
        <div className="cta-logo">
          <Logo size={72} />
        </div>
        <h2 id="cta-title">Someone new is one tap away.</h2>
        <p>Download TalkLink, grab your 100 welcome credits and start your first conversation today.</p>
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
          <Logo size={34} />
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
        TalkLink is a free Android app to {KEYWORDS.join(' · ')}. For adults 18+ only. Credits have no cash value. ©{' '}
        {new Date().getFullYear()} TalkLink.
      </p>
    </div>
  </footer>
);
