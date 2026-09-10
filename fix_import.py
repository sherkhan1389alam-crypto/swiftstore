import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.startswith("import { ShoppingBag"):
        lines[i] = "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, Instagram, Facebook, Youtube, Send, Truck, RotateCcw, ShieldCheck, HeadphonesIcon } from 'lucide-react';\n"

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.writelines(lines)
