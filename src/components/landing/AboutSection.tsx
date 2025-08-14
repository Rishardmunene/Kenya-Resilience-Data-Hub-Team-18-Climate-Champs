export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About KCRD
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The Kenya Climate Resilience Dashboard is a comprehensive platform designed to address the Triple Planetary Crisis: climate change, biodiversity loss, and pollution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-6">
              We are committed to providing real-time environmental data and insights to support evidence-based decision making across Kenya. Our platform integrates data from multiple sources including meteorological stations, satellite imagery, and ground sensors.
            </p>
            <p className="text-gray-600 mb-6">
              By leveraging advanced analytics and machine learning, we help government agencies, researchers, and communities understand climate patterns, predict environmental changes, and develop effective adaptation strategies.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Real-time climate monitoring</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Predictive analytics</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Community engagement</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-lg">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Objectives</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Climate Monitoring</h5>
                  <p className="text-gray-600 text-sm">Track temperature, rainfall, air quality, and other environmental parameters across all 47 counties.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Early Warning Systems</h5>
                  <p className="text-gray-600 text-sm">Provide timely alerts for extreme weather events, droughts, and other climate-related risks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Policy Support</h5>
                  <p className="text-gray-600 text-sm">Enable data-driven policy making for climate adaptation and mitigation strategies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
