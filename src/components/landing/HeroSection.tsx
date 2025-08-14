import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Kenya Climate Resilience Dashboard
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
            Empowering decision-makers with real-time environmental insights to address the Triple Planetary Crisis and build climate resilience across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link 
              href="#about" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">47</div>
            <div className="text-primary-100">Counties Monitored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-primary-100">Real-time Data</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100+</div>
            <div className="text-primary-100">Data Sources</div>
          </div>
        </div>
      </div>
    </section>
  );
}
