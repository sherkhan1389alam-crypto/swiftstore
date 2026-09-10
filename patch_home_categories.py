import re

with open("src/pages/store/Home.tsx", "r") as f:
    content = f.read()

# Replace category fetch logic
content = re.sub(
    r'const catSnap = await getDocs\(collection\(db, \'categories\'\)\);\s*setCategories\(catSnap\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \} as any\)\)\);',
    r"""const catQ = query(collection(db, 'categories'), where('status', '==', 'ENABLED'));
        const catSnap = await getDocs(catQ);
        const fetchedCats = catSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        fetchedCats.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(fetchedCats);""",
    content
)

# Update placeholder for missing images
content = re.sub(
    r'<div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-lg text-center p-2">\{category\.name\}</div>',
    r'<div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300"><div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</div></div>',
    content
)

with open("src/pages/store/Home.tsx", "w") as f:
    f.write(content)
