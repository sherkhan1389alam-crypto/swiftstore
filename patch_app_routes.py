import re

with open("src/App.tsx", "r") as f:
    content = f.read()

if 'import HeroBanners' not in content:
    content = content.replace(
        "import Categories from './pages/admin/Categories';",
        "import Categories from './pages/admin/Categories';\nimport HeroBanners from './pages/admin/HeroBanners';"
    )

content = content.replace(
    "<Route path=\"categories\" element={<Categories />} />",
    "<Route path=\"categories\" element={<Categories />} />\n            <Route path=\"hero-banners\" element={<HeroBanners />} />"
)

with open("src/App.tsx", "w") as f:
    f.write(content)
