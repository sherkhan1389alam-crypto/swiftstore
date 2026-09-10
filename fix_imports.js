import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

code = code.replace(
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from \"lucide-react\";",
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle } from \"lucide-react\";"
);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
