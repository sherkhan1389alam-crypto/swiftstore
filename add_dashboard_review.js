import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

if (!code.includes('{ title: "Total Reviews"')) {
  code = code.replace(
    "{ title: \"Total Products\", value: stats.products, icon: Grid, color: \"text-pink-600\", bg: \"bg-pink-100\" },",
    "{ title: \"Total Products\", value: stats.products, icon: Grid, color: \"text-pink-600\", bg: \"bg-pink-100\" },\n    { title: \"Total Reviews\", value: stats.totalReviews, icon: Star, color: \"text-amber-500\", bg: \"bg-amber-50\" },"
  );
  
  if (!code.includes('Star,')) {
    code = code.replace(
      "import { LayoutDashboard, ShoppingBag, Grid, Users, TrendingUp, IndianRupee, Clock, RefreshCcw } from 'lucide-react';",
      "import { LayoutDashboard, ShoppingBag, Grid, Users, TrendingUp, IndianRupee, Clock, RefreshCcw, Star } from 'lucide-react';"
    );
  }
  
  fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
}
