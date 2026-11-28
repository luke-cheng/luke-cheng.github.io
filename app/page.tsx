export default function HomePage() {
  return (
    <main className="stitch-home" aria-labelledby="home-title">
      <section className="stitch-home__hero">
        <div>
          <h1 id="home-title">Hi, welcome to my website.</h1>
          <p>
            Yes, I&apos;m a human, was a chemist, always a thinker, now a developer empowered by AI.
          </p>
        </div>

        <ul className="stitch-home__features" aria-label="Website features">
          <li>
            <span className="capability-mark capability-mark--ready" aria-hidden="true">✓</span>
            <strong>Interactive AI chat on anything about me</strong>
            <span className="capability-mark capability-mark--note" aria-hidden="true">✗</span>
            <span className="stitch-home__feature-note">Only works on Chrome &gt; 148</span>
          </li>
          <li>
            <span className="capability-mark capability-mark--ready" aria-hidden="true">✓</span>
            <strong>The AI knows my full work experience &amp; most of my life stories</strong>
            <span className="capability-mark capability-mark--note" aria-hidden="true">✗</span>
            <span className="stitch-home__feature-note">Interpreted with intellectual of a small language model</span>
          </li>
          <li>
            <span className="capability-mark capability-mark--ready" aria-hidden="true">✓</span>
            <strong>Privacy for you</strong>
            <span className="capability-mark capability-mark--note" aria-hidden="true">✗</span>
            <span className="stitch-home__feature-note">You will lose your entire chat history the second you close the tab</span>
          </li>
          <li>
            <span className="capability-mark capability-mark--ready" aria-hidden="true">✓</span>
            <strong>Zero cost, no server behind this website</strong>
            <span className="capability-mark capability-mark--note" aria-hidden="true">✗</span>
            <span className="stitch-home__feature-note">The on-device AI quietly chomps 2GB+ of your local disk space</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
