import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<Link to="/categories" className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Categories</Link>',
    '''<Link to="/categories" className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Categories</Link>
              {isAdmin && (
                <Link to="/admin" className="text-indigo-600 font-bold hover:text-indigo-800 text-sm flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                  Admin Panel
                </Link>
              )}'''
)

content = content.replace(
    '<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Support</h3>',
    '''{isAdmin && (
                <Link to="/admin" className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 mb-4 hover:bg-indigo-100">
                  <LayoutDashboard className="h-4 w-4" /> Open Admin Panel
                </Link>
              )}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Support</h3>'''
)

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)

