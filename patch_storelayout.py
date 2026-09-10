import re

with open('src/layouts/StoreLayout.tsx', 'r') as f:
    content = f.read()

pattern = r'\{isAdmin && \(\s*<Link to="/admin".*?Owner Panel\s*</Link>\s*\)\}'

replacement = """<Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-[#0b382d] rounded-xl shadow-sm mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  Owner Panel
                </Link>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/layouts/StoreLayout.tsx', 'w') as f:
    f.write(content)

