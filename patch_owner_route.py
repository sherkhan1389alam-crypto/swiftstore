import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('{/* Admin Panel */}', '{/* Admin Panel */}\n        <Route path="/owner/*" element={<Navigate to="/admin" replace />} />')

with open('src/App.tsx', 'w') as f:
    f.write(content)
