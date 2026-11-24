import Link from "next/link";

const careerMilestones = [
  {
    period: "2025 — Present",
    organization: "JPMorgan Chase",
    role: "Software Engineer",
  },
  {
    period: "2024 — 2025",
    organization: "MOYU",
    role: "Co-Founder & Lead Developer",
  },
  {
    period: "2021 — 2022",
    organization: "ChemPacific",
    role: "Research Scientist",
  },
];

export default function AboutPage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="about-title">
        <div className="home-copy">
          <p className="eyebrow">Software engineer / New York City</p>
          <h1 id="about-title">
            From scientist to developer,
            <em> keep digging on how things work.</em>
          </h1>
          <p className="home-lead">
            I build practical AI workflows and dependable software systems.
          </p>
          <nav className="home-actions" aria-label="Explore the site">
            <Link className="home-action home-action--primary" href="/work/">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="home-action" href="/chat/">
              Ask the on-device assistant
            </Link>
          </nav>
          <p className="home-ai-note">
            <span className="status-dot ready" aria-hidden="true" />
            The portfolio assistant runs in your browser on supported devices.
          </p>
        </div>

        <aside className="home-aside" aria-label="Career highlights">
          <div className="home-career">
            <p className="eyebrow">A few chapters</p>
            <ul>
              {careerMilestones.map((milestone) => (
                <li key={milestone.organization}>
                  <div>
                    <p className="career-period">{milestone.period}</p>
                    <h2>{milestone.organization}</h2>
                    <p className="career-role">{milestone.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
