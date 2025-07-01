export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-gray-900 snap-start">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Experience</h2>
          <p className="text-xl text-gray-300">
            A brief glimpse into my professional journey
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="bg-gray-800 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">The Professional Stuff</h3>
            <p className="text-gray-300 mb-6">
              I've worked across different domains—from pharmaceutical research to healthcare systems, 
              from stealth startups to established institutions. Each role taught me something about 
              how technology can bridge gaps between people and possibilities.
            </p>
            <p className="text-gray-300 mb-6">
              Currently building something interesting at a stealth startup in Pittsburgh. 
              Before that, I was part of the team at UPMC working on healthcare systems that 
              actually make doctors' lives easier (shocking, I know).
            </p>
            <p className="text-gray-300 mb-6">
              Started my journey as a research scientist at ChemPacific, where I learned that 
              automation isn't just about efficiency—it's about enabling entirely new ways of working.
            </p>
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
              <p className="text-blue-300 font-medium">
                Looking for the detailed professional resume with all the buzzwords and metrics? 
                That's what LinkedIn is for! 
                <a 
                  href="https://linkedin.com/in/luke-cheng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  Check it out here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 