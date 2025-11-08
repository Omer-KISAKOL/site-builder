export default function Sidebar({ data }) {
  const style = data?.style || {};
  const items = data?.items || [];
  const title = data?.title || '';

  return (
    <aside 
      className="w-64 min-h-screen shadow-lg"
      style={{ 
        backgroundColor: style.backgroundColor || '#f8f9fa',
        color: style.textColor || '#000000'
      }}
    >
      <div className="p-6">
        {title && (
          <h2 
            className="text-lg font-semibold mb-6" 
            style={{ color: style.textColor || '#000000' }}
          >
            {title}
          </h2>
        )}
        
        <nav className="space-y-2">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-black hover:bg-opacity-5 transition-colors group"
              style={{ color: style.textColor || '#000000' }}
            >
              {/* Icon placeholder */}
              {item.icon && (
                <span className="text-sm opacity-70 group-hover:opacity-100">
                  {getIcon(item.icon)}
                </span>
              )}
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// Simple icon helper
function getIcon(iconName) {
  const icons = {
    home: '🏠',
    settings: '⚙️',
    user: '👤',
    dashboard: '📊',
    analytics: '📈',
    folder: '📁',
    file: '📄',
    heart: '❤️',
    star: '⭐',
    default: '•'
  };
  
  return icons[iconName] || icons.default;
}

