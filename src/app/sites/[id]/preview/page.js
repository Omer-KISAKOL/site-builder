'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PreviewSite() {
  const params = useParams();
  const siteId = params.id;

  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSiteData();
  }, [siteId]);

  const fetchSiteData = async () => {
    try {
      const res = await fetch(`/api/sites/${siteId}`);
      if (!res.ok) {
        throw new Error('Site yüklenemedi');
      }
      const data = await res.json();
      setSite(data.site);
      setComponents(data.components);
    } catch (err) {
      setError('Site yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getComponentByType = (type) => {
    return components.find(c => c.component_type === type && c.is_active);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Site bulunamadı'}</div>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Dashboard'a Dön
          </Link>
        </div>
      </div>
    );
  }

  const navbarComponent = getComponentByType('navbar');
  const sidebarComponent = getComponentByType('sidebar');
  const contentComponent = getComponentByType('content');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="text-sm">
          🔍 Önizleme Modu - <span className="font-semibold">{site.name}</span>
        </div>
        <Link
          href={`/sites/${siteId}/edit`}
          className="text-xs px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          ✏️ Düzenle
        </Link>
      </div>

      {/* Rendered Site */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarComponent && (
          <RenderSidebar data={sidebarComponent.component_data} />
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Navbar */}
          {navbarComponent && (
            <RenderNavbar data={navbarComponent.component_data} />
          )}

          {/* Content */}
          {contentComponent && (
            <RenderContent data={contentComponent.component_data} />
          )}
        </div>
      </div>
    </div>
  );
}

// Render Navbar
function RenderNavbar({ data }) {
  const style = data.style || {};
  
  return (
    <nav 
      className="shadow-sm"
      style={{ 
        backgroundColor: style.backgroundColor || '#ffffff',
        color: style.textColor || '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            {data.logo || 'Logo'}
          </div>
          <div className="flex space-x-8">
            {(data.items || []).map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="hover:opacity-75 transition-opacity"
                style={{ color: style.textColor || '#000000' }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Render Sidebar
function RenderSidebar({ data }) {
  const style = data.style || {};
  
  return (
    <aside 
      className="w-64 min-h-screen shadow-lg"
      style={{ 
        backgroundColor: style.backgroundColor || '#f8f9fa',
        color: style.textColor || '#000000'
      }}
    >
      <div className="p-6">
        {data.title && (
          <h2 className="text-lg font-semibold mb-6" style={{ color: style.textColor }}>
            {data.title}
          </h2>
        )}
        <nav className="space-y-2">
          {(data.items || []).map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="block px-4 py-2 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors"
              style={{ color: style.textColor || '#000000' }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// Render Content
function RenderContent({ data }) {
  return (
    <main className="bg-white">
      {(data.sections || []).map((section, index) => (
        <div key={index}>
          {section.type === 'hero' && (
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
                    className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {section.buttonText}
                  </a>
                )}
              </div>
            </div>
          )}
          
          {section.type === 'text' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                {section.title || 'Başlık'}
              </h2>
              <p className="text-lg text-gray-600">
                {section.content || 'İçerik buraya gelecek'}
              </p>
            </div>
          )}

          {section.type === 'cards' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                {section.title || 'Başlık'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.cards || []).map((card, cardIndex) => (
                  <div key={cardIndex} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Default content if no sections */}
      {(!data.sections || data.sections.length === 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gray-500">
            Henüz içerik eklenmemiş. Düzenleme moduna geçip içerik ekleyebilirsiniz.
          </p>
        </div>
      )}
    </main>
  );
}

