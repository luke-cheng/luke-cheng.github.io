"use client";

interface AppBarProps {
  isSticky: boolean;
}

export default function AppBar({ isSticky }: AppBarProps) {
  return (
    <>
      {/* Static Navigation Bar - initially visible under welcome section */}
      <nav className={`w-full bg-black/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${
        isSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-lg">Luke Cheng</div>
          
          <div className="flex gap-6">
            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("experience")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Experience
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Projects
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("blog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Blog
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Sticky Navigation Bar - appears when welcome section is out of view */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-white font-bold text-lg">Luke Cheng</div>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("experience")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Experience
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Projects
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("blog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Blog
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
