export default function Navbar({ data }) {
  const style = data?.style || {};
  const items = data?.items || [];
  const logo = data?.logo || 'Logo';

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
          {/* Logo */}
          <div className="flex-shrink-0">
            <span 
              className="font-bold text-xl"
              style={{ color: style.textColor || '#000000' }}
            >
              {logo}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-8">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="hover:opacity-75 transition-opacity font-medium"
                style={{ color: style.textColor || '#000000' }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md"
              style={{ color: style.textColor || '#000000' }}
              onClick={() => {
                // Mobile menu toggle - basit implementasyon
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                }
              }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t" style={{ borderColor: style.textColor + '20' }}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="block px-3 py-2 rounded-md hover:opacity-75 transition-opacity"
              style={{ color: style.textColor || '#000000' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

