import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

# Replace missing lucide icons with standard ones available
content = content.replace("import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, Instagram, Facebook, Youtube, Send, Truck, RotateCcw, ShieldCheck, HeadphonesIcon } from 'lucide-react';", 
                          "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, Truck, RotateCcw, ShieldCheck, HeadphonesIcon } from 'lucide-react';")

# In the footer, just remove the specific social icons if they cause errors
content = content.replace('<Facebook className="w-5 h-5" />', 'FB')
content = content.replace('<Instagram className="w-5 h-5" />', 'IG')
content = content.replace('<Youtube className="w-5 h-5" />', 'YT')
content = content.replace('<Send className="w-5 h-5" />', '✉')
content = content.replace('<Send className="w-8 h-8 text-emerald-400" />', '✉')

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)
