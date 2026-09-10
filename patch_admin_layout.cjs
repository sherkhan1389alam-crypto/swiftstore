const fs = require('fs');
let content = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const newNavigation = `
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { 
      name: 'Products', 
      icon: Grid,
      subItems: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/new' },
      ]
    },
    { name: 'Categories', href: '/admin/categories', icon: Grid },
    { name: 'Hero Banners', href: '/admin/hero-banners', icon: ImageIcon },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Fulfillment', href: '/admin/fulfillment', icon: Truck },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard },
    { name: 'Branding', href: '/admin/branding', icon: Image },
    { name: 'Payment Settings', href: '/admin/payment-settings', icon: CreditCard },
    { name: 'Shipping Settings', href: '/admin/shipping', icon: Truck },
    { name: 'Security', href: '/admin/security', icon: Settings }
  ];
`;

content = content.replace(/const navigation = \[[\s\S]*?\];/, newNavigation.trim());

fs.writeFileSync('src/layouts/AdminLayout.tsx', content);
