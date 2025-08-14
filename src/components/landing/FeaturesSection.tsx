export function FeaturesSection() {
  const features = [
    {
      icon: "🌡️",
      title: "Real-time Monitoring",
      description: "Track temperature, humidity, air quality, and rainfall patterns across Kenya with live data updates every 15 minutes."
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Leverage machine learning algorithms to predict climate trends and identify potential environmental risks."
    },
    {
      icon: "🗺️",
      title: "Interactive Maps",
      description: "Visualize climate data on interactive maps with regional overlays and customizable time ranges."
    },
    {
      icon: "⚠️",
      title: "Early Warning System",
      description: "Receive timely alerts for extreme weather events, droughts, and other climate-related emergencies."
    },
    {
      icon: "📈",
      title: "Trend Analysis",
      description: "Analyze historical climate patterns and identify long-term trends to support planning decisions."
    },
    {
      icon: "🤝",
      title: "Collaborative Platform",
      description: "Share insights and collaborate with other stakeholders through integrated communication tools."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful tools and capabilities that make KCRD the leading climate resilience platform in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who are already making data-driven decisions for climate resilience.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
