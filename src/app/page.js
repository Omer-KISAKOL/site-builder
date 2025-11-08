'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Token varsa dashboard'a yönlendir
    const token = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <main className="w-full max-w-4xl px-8 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Site Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Profesyonel web siteleri kolayca oluşturun
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Kod yazmadan, sürükle-bırak ile güçlü web siteleri tasarlayın
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/register"
            className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 Ücretsiz Başla
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Kolay Tasarım
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Navbar, sidebar ve content alanlarını kolayca düzenleyin
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Hızlı & Güçlü
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Anlık önizleme ile değişikliklerinizi hemen görün
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-zinc-800">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Yayınlama
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sitelerinizi bir tıkla yayınlayın ve paylaşın
            </p>
          </div>
        </div>

        <div className="mt-16 text-sm text-gray-500 dark:text-gray-500">
          <p>Modern web teknolojileri ile geliştirildi</p>
          <p className="mt-2">Next.js • React • TailwindCSS • PostgreSQL</p>
        </div>
      </main>
    </div>
  );
}
