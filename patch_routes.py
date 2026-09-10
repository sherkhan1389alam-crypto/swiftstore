import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

import_statement = "import Security from './pages/admin/Security';"
route_statement = '<Route path="security" element={<Security />} />'

# Add import
content = content.replace("import AdminRoute from './components/AdminRoute';", "import AdminRoute from './components/AdminRoute';\nimport Security from './pages/admin/Security';")

# Add route
content = content.replace('<Route path="settings" element={<AdminPlaceholder title="Website Settings" />} />', '<Route path="settings" element={<AdminPlaceholder title="Website Settings" />} />\n            <Route path="security" element={<Security />} />')

with open('src/App.tsx', 'w') as f:
    f.write(content)
