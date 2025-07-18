import { Github, ExternalLink } from '@geist-ui/icons';

export default function ProjectsSection() {
  const projects = [
    {
      title: "Zero-Budget Website",
      description: "Yes, the one you're browsing right now! Built this personal website with React, Next.js, and Google Gemini AI. Features a chatbot that knows way too much about me, markdown rendering, and probably breaks every time I add a new feature. Deployed on Vercel because I'm too cheap for AWS.",
      technologies: ["React", "Next.js", "TypeScript", "Google Gemini", "Vercel"],
      link: "https://luke-cheng.github.io",
      github: false,
      featured: true
    },
    {
      title: "Android Morse Code Keyboard",
      description: "Built a custom Android Input Method Editor (IME) for learning Morse code. Includes haptic feedback, accessible UI, and probably the most niche app I've ever created. Because why not make communication more complicated?",
      technologies: ["Android", "Java", "Kotlin", "Jetpack Compose"],
      link: "https://github.com/luke-cheng/morse-keyboard",
      github: true
    },
    {
      title: "Screeps China",
      description: "Founded and led the Chinese community for Screeps, a JavaScript MMO game. Translated documentation, created tutorials, and built a community of developers who probably spent way too much time optimizing their virtual empires.",
      technologies: ["JavaScript", "Community Building", "Translation", "Documentation"],
      link: "https://github.com/screeps-cn",
      github: true
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-800 snap-start">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Projects</h2>
          <p className="text-xl text-gray-300">
            Things I've built when I should probably be doing something more productive
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`bg-gray-900 rounded-lg p-6 hover:bg-gray-850 transition-colors border ${
                project.featured 
                  ? 'border-blue-500/50 hover:border-blue-400/50' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 text-blue-400 text-sm">(You're here!)</span>
                  )}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {project.github ? (
                      <Github className="w-5 h-5" />
                    ) : (
                      <ExternalLink className="w-5 h-5" />
                    )}
                  </a>
                )}
              </div>
              
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 