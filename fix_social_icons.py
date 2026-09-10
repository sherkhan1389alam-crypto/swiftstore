import re
with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

content = re.sub(r'Facebook, Instagram, Youtube, Send,?', '', content)
content = re.sub(r', }', '}', content)

content = content.replace('<Facebook className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />', '<span>FB</span>')
content = content.replace('<Instagram className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />', '<span>IG</span>')
content = content.replace('<Youtube className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />', '<span>YT</span>')
content = content.replace('<Send className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />', '<span>TG</span>')

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)
