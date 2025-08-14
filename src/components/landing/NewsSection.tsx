export function NewsSection() {
  const news = [
    {
      title: "New Climate Monitoring Stations Installed in Northern Kenya",
      excerpt: "The KCRD team has successfully deployed 15 new weather monitoring stations across arid and semi-arid regions to improve drought prediction capabilities.",
      date: "2024-01-15",
      category: "Infrastructure",
      readTime: "3 min read"
    },
    {
      title: "Kenya Achieves 90% Renewable Energy Target Ahead of Schedule",
      excerpt: "The country has reached its renewable energy goal three years early, with geothermal and wind power leading the transition to clean energy.",
      date: "2024-01-12",
      category: "Energy",
      readTime: "5 min read"
    },
    {
      title: "Community-Led Reforestation Project Shows Promising Results",
      excerpt: "Local communities in the Mau Forest region have planted over 2 million trees, contributing to improved water catchment and biodiversity restoration.",
      date: "2024-01-10",
      category: "Conservation",
      readTime: "4 min read"
    },
    {
      title: "AI-Powered Climate Prediction Model Launched",
      excerpt: "Our new machine learning model can predict extreme weather events with 85% accuracy up to 72 hours in advance, helping communities prepare better.",
      date: "2024-01-08",
      category: "Technology",
      readTime: "6 min read"
    },
    {
      title: "Partnership with Universities Strengthens Research Capacity",
      excerpt: "Collaboration with leading Kenyan universities enhances our data analysis capabilities and provides valuable insights for policy development.",
      date: "2024-01-05",
      category: "Partnerships",
      readTime: "4 min read"
    },
    {
      title: "Mobile App Launch Brings Climate Data to Rural Communities",
      excerpt: "The new KCRD mobile application makes climate information accessible to farmers and rural communities through simple, user-friendly interfaces.",
      date: "2024-01-03",
      category: "Technology",
      readTime: "3 min read"
    }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest News & Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about the latest developments in climate resilience, environmental conservation, and our platform updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <article key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.date}</span>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
}
