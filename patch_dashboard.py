import re

with open("src/pages/admin/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace('bg-slate-50 font-sans', 'bg-[#FAFAFA] font-sans')
content = content.replace('bg-white rounded-2xl p-5 shadow-sm border border-slate-200', 'bg-white rounded-3xl p-6 shadow-sm border border-slate-100')
content = content.replace('bg-white rounded-2xl shadow-sm border border-slate-200 p-6', 'bg-white rounded-3xl shadow-sm border border-slate-100 p-6')
content = content.replace('text-2xl font-bold text-slate-900', 'text-3xl font-extrabold text-slate-900 tracking-tight mt-1')

with open("src/pages/admin/Dashboard.tsx", "w") as f:
    f.write(content)

