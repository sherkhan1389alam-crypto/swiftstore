import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

# Add a small subtle lock icon in the header for Admin Login
content = content.replace(
    '<Search className="h-5 w-5" />\n              </Link>',
    '''<Search className="h-5 w-5" />
              </Link>
              {!isAdmin && (
                <Link to="/admin/login" className="p-2 text-slate-300 hover:text-indigo-600" title="Admin Login">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hover:bg-indigo-600 transition-colors"></div>
                </Link>
              )}'''
)

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)

