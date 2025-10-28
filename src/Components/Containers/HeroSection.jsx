import { ChevronDown } from 'lucide-react';
const HeroSection = () => {
  return (
    <div className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80)' }}>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="font-[archivo] text-white max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-6">
            Discover Amazing Resources
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Find the best study materials, projects, and resources curated for computer science students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200">
              Get Started
            </button>
            <button className="border border-white hover:bg-white hover:text-slate-800 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200">
              Learn More
            </button>
          </div>

          {/* Stats section */}
          <div className="mt-12 flex flex-wrap gap-8 text-gray-200">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-gray-300">Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1K+</div>
              <div className="text-gray-300">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <ChevronDown size={24} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
