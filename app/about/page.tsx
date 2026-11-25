import Link from "next/link";

const careerMilestones = [
  {
    period: "2025 - Present",
    organization: "JPMorgan Chase & Co",
    role: "Software Engineer",
  },
  {
    period: "2024 - 2025",
    organization: "MOYU LLC",
    role: "Co-Founder & Lead Developer",
  },
  {
    period: "2022 - 2024",
    organization: "University of Pittsburgh",
    role: "Grad School & part-time Dev",
  },
  {
    period: "2021 - 2022",
    organization: "ChemPacific Corp",
    role: "Research Scientist",
  },
  {
    period: "2016 - 2020",
    organization: "Virginia Tech",
    role: "Chemistry UnderGrad",
  },
];

export default function AboutPage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="about-title">
        <div className="home-copy">
          <header className="page-heading">
            <h1 id="about-title">
              From scientist to developer,
              <em> keep digging on how things work.</em>
            </h1>
          </header>
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
        </div>

        <aside className="home-aside" aria-label="Career highlights">
          <div className="home-career">
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
