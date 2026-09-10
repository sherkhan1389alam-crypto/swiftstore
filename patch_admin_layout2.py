import re

with open("src/layouts/AdminLayout.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "{ name: 'Categories', href: '/admin/categories', icon: Grid },",
    "{ name: 'Categories', href: '/admin/categories', icon: Grid },\n    { name: 'Hero Banners', href: '/admin/hero-banners', icon: ImageIcon },"
)

if 'Image as ImageIcon' not in content:
    content = content.replace('Grid,', 'Grid, Image as ImageIcon,')

with open("src/layouts/AdminLayout.tsx", "w") as f:
    f.write(content)
