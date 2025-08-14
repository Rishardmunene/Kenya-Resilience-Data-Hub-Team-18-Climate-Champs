export function PartnersSection() {
  const partners = [
    {
      name: "Kenya Meteorological Department",
      logo: "🌤️",
      description: "Official weather and climate data provider for Kenya"
    },
    {
      name: "Ministry of Environment",
      logo: "🌱",
      description: "Government agency overseeing environmental policies"
    },
    {
      name: "UN Environment Programme",
      logo: "🌍",
      description: "Global environmental authority and knowledge hub"
    },
    {
      name: "World Bank",
      logo: "🏦",
      description: "International financial institution supporting climate initiatives"
    },
    {
      name: "African Development Bank",
      logo: "🏛️",
      description: "Regional development bank focused on African sustainability"
    },
    {
      name: "Local Universities",
      logo: "🎓",
      description: "Academic institutions providing research and expertise"
    }
  ];

  return (
    <section id="partners" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with leading organizations to ensure the highest quality data and insights for climate resilience in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="text-5xl mb-4">{partner.logo}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {partner.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Become a Partner
            </h3>
            <p className="text-gray-600 mb-6">
              Join our network of partners and contribute to building climate resilience across Kenya.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
