'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndSites();
  }, []);

  const fetchUserAndSites = async () => {
    try {
      // Kullanıcı bilgilerini al
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login?redirect=/dashboard');
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // Kullanıcının sitelerini al
      const sitesRes = await fetch('/api/sites');
      if (sitesRes.ok) {
        const sitesData = await sitesRes.json();
        setSites(sitesData.sites || []);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = async (siteId) => {
    if (!confirm('Bu siteyi silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSites(sites.filter(site => site.id !== siteId));
      } else {
        alert('Site silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Site silme hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Site Builder
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Hoş geldin, {user?.name || user?.email}
              </p>
            </div>
            <div className="flex gap-3">
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  👑 Admin Panel
                </Link>
              )}
              <Link
                href="/settings"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Ayarlar
              </Link>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => {
                      document.cookie = 'token=; path=/; max-age=0';
                      router.push('/login');
                    });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sitelerim
          </h2>
          <Link
            href="/sites/create"
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Yeni Site Oluştur
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Henüz site oluşturmadınız
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              İlk sitenizi oluşturarak başlayın
            </p>
            <div className="mt-6">
              <Link
                href="/sites/create"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Yeni Site Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {site.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {site.domain || 'Domain ayarlanmamış'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Oluşturulma: {new Date(site.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-zinc-800 px-6 py-4 flex justify-between">
                  <Link
                    href={`/sites/${site.id}/edit`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Düzenle
                  </Link>
                  <Link
                    href={`/sites/${site.id}/preview`}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Önizle
                  </Link>
                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

