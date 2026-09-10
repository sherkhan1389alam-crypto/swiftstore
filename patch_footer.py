import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '<div>&copy; {new Date().getFullYear()} SwiftStore. All rights reserved.</div>',
    '''<div>
              &copy; {new Date().getFullYear()} SwiftStore. All rights reserved.
              <span className="mx-2">|</span>
              <Link to="/admin/login" className="text-slate-400 hover:text-indigo-600">Owner Login</Link>
            </div>'''
)

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)

