'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditSite() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [site, setSite] = useState(null);
  const [components, setComponents] = useState([]);
  const [activeTab, setActiveTab] = useState('navbar');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSiteData();
  }, [siteId]);

  const fetchSiteData = async () => {
    try {
      const res = await fetch(`/api/sites/${siteId}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/dashboard');
          return;
        }
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
    return components.find(c => c.component_type === type);
  };

  const updateComponent = async (componentId, componentData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/components`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentId,
          component_data: componentData
        }),
      });

      if (!res.ok) {
        throw new Error('Güncelleme başarısız');
      }

      // Local state'i güncelle
      setComponents(components.map(c => 
        c.id === componentId 
          ? { ...c, component_data: componentData }
          : c
      ));

      // Başarı mesajı göster (kısa süre)
      alert('Değişiklikler kaydedildi!');
    } catch (err) {
      alert('Kaydetme hatası: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-red-600">{error || 'Site bulunamadı'}</div>
      </div>
    );
  }

  const navbarComponent = getComponentByType('navbar');
  const sidebarComponent = getComponentByType('sidebar');
  const contentComponent = getComponentByType('content');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {site.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {site.domain || 'Domain ayarlanmamış'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/sites/${siteId}/preview`}
                target="_blank"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                👁️ Önizle
              </Link>
              <button
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Panel - Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-zinc-800">
                <nav className="flex -mb-px">
                  {[
                    { id: 'navbar', label: 'Navbar', icon: '📱' },
                    { id: 'sidebar', label: 'Sidebar', icon: '📋' },
                    { id: 'content', label: 'İçerik', icon: '📄' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'navbar' && navbarComponent && (
                  <NavbarEditor
                    component={navbarComponent}
                    onSave={(data) => updateComponent(navbarComponent.id, data)}
                  />
                )}
                {activeTab === 'sidebar' && sidebarComponent && (
                  <SidebarEditor
                    component={sidebarComponent}
                    onSave={(data) => updateComponent(sidebarComponent.id, data)}
                  />
                )}
                {activeTab === 'content' && contentComponent && (
                  <ContentEditor
                    component={contentComponent}
                    onSave={(data) => updateComponent(contentComponent.id, data)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Site Ayarları */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Site Ayarları
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Adı
                  </label>
                  <input
                    type="text"
                    value={site.name}
                    onChange={(e) => setSite({ ...site, name: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={site.domain || ''}
                    onChange={(e) => setSite({ ...site, domain: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    rows={3}
                    value={site.description || ''}
                    onChange={(e) => setSite({ ...site, description: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/sites/${siteId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(site),
                      });
                      if (res.ok) {
                        alert('Site bilgileri güncellendi!');
                      }
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Site Bilgilerini Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navbar Editor Component
function NavbarEditor({ component, onSave }) {
  const [data, setData] = useState(component.component_data);

  const addItem = () => {
    const newItems = [...(data.items || []), { label: 'Yeni Menü', link: '/' }];
    setData({ ...data, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo / Site Adı
        </label>
        <input
          type="text"
          value={data.logo || ''}
          onChange={(e) => setData({ ...data, logo: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Menü Öğeleri
          </label>
          <button
            onClick={addItem}
            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Ekle
          </button>
        </div>
        <div className="space-y-3">
          {(data.items || []).map((item, index) => (
            <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, 'label', e.target.value)}
                placeholder="Menü adı"
                className="flex-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => updateItem(index, 'link', e.target.value)}
                placeholder="Link"
                className="flex-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              />
              <button
                onClick={() => removeItem(index)}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arkaplan Rengi
          </label>
          <input
            type="color"
            value={data.style?.backgroundColor || '#ffffff'}
            onChange={(e) => setData({ 
              ...data, 
              style: { ...data.style, backgroundColor: e.target.value } 
            })}
            className="block w-full h-10 rounded border border-gray-300 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Yazı Rengi
          </label>
          <input
            type="color"
            value={data.style?.textColor || '#000000'}
            onChange={(e) => setData({ 
              ...data, 
              style: { ...data.style, textColor: e.target.value } 
            })}
            className="block w-full h-10 rounded border border-gray-300 dark:border-zinc-700"
          />
        </div>
      </div>

      <button
        onClick={() => onSave(data)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Navbar Kaydet
      </button>
    </div>
  );
}

// Sidebar Editor Component
function SidebarEditor({ component, onSave }) {
  const [data, setData] = useState(component.component_data);

  const addItem = () => {
    const newItems = [...(data.items || []), { label: 'Yeni Öğe', link: '/', icon: 'default' }];
    setData({ ...data, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sidebar Başlığı
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="block w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sidebar Öğeleri
          </label>
          <button
            onClick={addItem}
            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Ekle
          </button>
        </div>
        <div className="space-y-3">
          {(data.items || []).map((item, index) => (
            <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, 'label', e.target.value)}
                placeholder="Öğe adı"
                className="flex-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => updateItem(index, 'link', e.target.value)}
                placeholder="Link"
                className="flex-1 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              />
              <button
                onClick={() => removeItem(index)}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arkaplan Rengi
          </label>
          <input
            type="color"
            value={data.style?.backgroundColor || '#f8f9fa'}
            onChange={(e) => setData({ 
              ...data, 
              style: { ...data.style, backgroundColor: e.target.value } 
            })}
            className="block w-full h-10 rounded border border-gray-300 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Yazı Rengi
          </label>
          <input
            type="color"
            value={data.style?.textColor || '#000000'}
            onChange={(e) => setData({ 
              ...data, 
              style: { ...data.style, textColor: e.target.value } 
            })}
            className="block w-full h-10 rounded border border-gray-300 dark:border-zinc-700"
          />
        </div>
      </div>

      <button
        onClick={() => onSave(data)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Sidebar Kaydet
      </button>
    </div>
  );
}

// Content Editor Component
function ContentEditor({ component, onSave }) {
  const [data, setData] = useState(component.component_data);

  const updateSection = (index, field, value) => {
    const newSections = [...(data.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setData({ ...data, sections: newSections });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {(data.sections || []).map((section, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Section {index + 1} - {section.type}
            </h4>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt Başlık
              </label>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm"
              />
            </div>

            {section.type === 'hero' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    value={section.buttonText || ''}
                    onChange={(e) => updateSection(index, 'buttonText', e.target.value)}
                    className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buton Linki
                  </label>
                  <input
                    type="text"
                    value={section.buttonLink || ''}
                    onChange={(e) => updateSection(index, 'buttonLink', e.target.value)}
                    className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onSave(data)}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        İçerik Kaydet
      </button>
    </div>
  );
}

