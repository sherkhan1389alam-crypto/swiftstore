import re

with open("src/App.tsx", "r") as f:
    content = f.read()

if 'import HeroBanners' not in content:
    content = content.replace(
        "import AdminCategories from './pages/admin/Categories';",
        "import AdminCategories from './pages/admin/Categories';\nimport HeroBanners from './pages/admin/HeroBanners';"
    )

content = content.replace(
    '<Route path="categories" element={<AdminCategories />} />',
    '<Route path="categories" element={<AdminCategories />} />\n            <Route path="hero-banners" element={<HeroBanners />} />'
)

with open("src/App.tsx", "w") as f:
    f.write(content)
