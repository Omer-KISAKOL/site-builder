export default function Content({ data }) {
  const sections = data?.sections || [];

  if (sections.length === 0) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">Henüz içerik eklenmemiş</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {sections.map((section, index) => (
        <div key={index}>
          {section.type === 'hero' && <HeroSection section={section} />}
          {section.type === 'text' && <TextSection section={section} />}
          {section.type === 'cards' && <CardsSection section={section} />}
          {section.type === 'features' && <FeaturesSection section={section} />}
          {section.type === 'cta' && <CTASection section={section} />}
        </div>
      ))}
    </main>
  );
}

// Hero Section
function HeroSection({ section }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">
          {section.title || 'Başlık'}
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          {section.subtitle || 'Alt başlık'}
        </p>
        {section.buttonText && (
          <a
            href={section.buttonLink || '#'}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {section.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

// Text Section
function TextSection({ section }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {section.title && (
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          {section.title}
        </h2>
      )}
      {section.content && (
        <div className="text-lg text-gray-600 prose max-w-none">
          {section.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// Cards Section
function CardsSection({ section }) {
  const cards = section.cards || [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {section.title && (
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          {section.title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {card.icon && (
              <div className="text-4xl mb-4">{card.icon}</div>
            )}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {card.title}
            </h3>
            <p className="text-gray-600">
              {card.description}
            </p>
            {card.link && (
              <a 
                href={card.link}
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Daha fazla →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Features Section
function FeaturesSection({ section }) {
  const features = section.features || [];
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h2 className="text-3xl font-bold mb-12 text-gray-900 text-center">
            {section.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl">
                  {feature.icon || '✓'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Call to Action Section
function CTASection({ section }) {
  return (
    <div className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {section.title && (
          <h2 className="text-3xl font-bold mb-4 text-white">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="text-xl mb-8 text-blue-100">
            {section.subtitle}
          </p>
        )}
        {section.buttonText && (
          <a
            href={section.buttonLink || '#'}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {section.buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

