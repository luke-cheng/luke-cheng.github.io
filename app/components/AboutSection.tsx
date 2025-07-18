export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-800 snap-start">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-xl text-gray-300">
            At core, I'm a thinker. From chemistry to programming, I chase the patterns that connect everything.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Personal Story */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">The Transition</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                I started as a chemist, watching how chemical testing instruments revolutionized pharmaceutical research—turning days of work into minutes. That's when I saw the pattern: technology doesn't just automate tasks; it transforms entire fields.
              </p>
              <p>
                Laboratory systems made cross-continent collaboration possible. Suddenly, researchers in Pittsburgh could work seamlessly with teams in Beijing. That's the kind of impact I wanted to create—not just faster processes, but entirely new possibilities.
              </p>
              <p>
                So I made the jump to software engineering. Now I'm building tools that bridge gaps between human potential and technological barriers. Whether it's healthcare systems, translation platforms, cybersecurity tools, or educational software—I'm drawn to projects that connect people and ideas across boundaries.
              </p>
              <p>
                Currently working at a stealth startup in Pittsburgh, where I'm probably overthinking the architecture while my teammates wonder why I'm refactoring code that already works.
              </p>
            </div>
          </div>

          {/* Right Column - Education & Current State */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Education & Current State</h3>
            
            {/* Education */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-white mb-3">Education</h4>
              <div className="space-y-3">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h5 className="font-medium text-white">MS in Information Science</h5>
                  <p className="text-gray-300">University of Pittsburgh | GPA 3.8</p>
                  <p className="text-sm text-gray-400">Aug 2022 - May 2024</p>
                  <p className="text-sm text-gray-400 mt-1">Algorithms, ML, Interactive Systems, Cryptography</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h5 className="font-medium text-white">BS in Chemistry and Philosophy</h5>
                  <p className="text-gray-300">Virginia Tech | GPA 3.5</p>
                  <p className="text-sm text-gray-400">Aug 2016 - Dec 2020</p>
                  <p className="text-sm text-gray-400 mt-1">Software Design, Java, Ethics & AI</p>
                </div>
              </div>
            </div>

            {/* Current Focus */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3">What currently occupies my mind</h4>
              <div className="space-y-2 text-gray-300">
                <p>- How to make complex systems feel simple</p>
                <p>- The intersection of healthcare and technology</p>
                <p>- Building tools that actually get used</p>
                <p>- Why my website keeps breaking when I add features</p>
                <p>- What to write for my next blog post</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 