import re

with open("src/pages/store/Categories.tsx", "r") as f:
    content = f.read()

# Replace imports to include Grid
content = re.sub(
    r"import \{ Loader2 \} from 'lucide-react';",
    r"import { Loader2, Grid } from 'lucide-react';",
    content
)

# Update Link to /shop?category=
content = re.sub(
    r'`/category/\$\{category.id\}`',
    r'`/shop?category=${category.id}`',
    content
)

# Replace the grid render
grid_render = """<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-10">
          {categories.map((category, idx) => (
            <Link key={idx} to={`/shop?category=${category.id}`} className="group flex flex-col items-center gap-4">
              <div className="w-full aspect-square rounded-2xl bg-[#f8f9fa] border border-slate-100 overflow-hidden flex items-center justify-center p-3 group-hover:border-emerald-200 group-hover:shadow-lg transition-all shadow-sm">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-xl text-slate-400">
                    <Grid className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-slate-800 font-bold text-sm sm:text-base group-hover:text-emerald-700 transition-colors leading-tight">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>"""

content = re.sub(r'<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">.*?</Link>\s*\)\)\}\s*</div>', grid_render, content, flags=re.DOTALL)

with open("src/pages/store/Categories.tsx", "w") as f:
    f.write(content)
