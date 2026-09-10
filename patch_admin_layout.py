import re

with open("src/layouts/AdminLayout.tsx", "r") as f:
    content = f.read()

# Add Hero Banners below Categories
content = re.sub(
    r'(<Link to="/admin/categories" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 \${location\.pathname === \'/admin/categories\' \? \'bg-indigo-600 text-white shadow-md shadow-indigo-200\' : \'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600\'}`}>.*?<span>Categories</span>.*?</Link>)',
    r'\1\n            <Link to="/admin/hero-banners" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === \'/admin/hero-banners\' ? \'bg-indigo-600 text-white shadow-md shadow-indigo-200\' : \'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600\'}`}>\n              <Image className="h-5 w-5 mr-3" />\n              <span>Hero Banners</span>\n            </Link>',
    content,
    flags=re.DOTALL
)

# Also need to import Image icon if not present
if 'Image,' not in content and 'Image as ImageIcon' not in content:
    content = content.replace('LayoutDashboard,', 'LayoutDashboard, Image,')

with open("src/layouts/AdminLayout.tsx", "w") as f:
    f.write(content)
