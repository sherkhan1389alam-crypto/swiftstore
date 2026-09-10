import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

if (!code.includes('totalReviews: 0')) {
  // Update state
  code = code.replace(
    'todayOrders: 0\n  });',
    'todayOrders: 0,\n    totalReviews: 0\n  });'
  );
  
  // Add fetch
  code = code.replace(
    "getDocs(collection(db, 'orders')),",
    "getDocs(collection(db, 'orders')),\n          getDocs(collection(db, 'reviews')),"
  );
  
  code = code.replace(
    "const [ordersSnap, productsSnap] = await Promise.all([",
    "const [ordersSnap, reviewsSnap, productsSnap] = await Promise.all(["
  );
  
  code = code.replace(
    "todayOrders: todayOrdersCount,\n          netProfit: grossProf * 0.85 // Dummy approx net profit \n        });",
    "todayOrders: todayOrdersCount,\n          netProfit: grossProf * 0.85,\n          totalReviews: reviewsSnap.size\n        });"
  );
  
  // Replace one of the statCards. Let's find statCards.
  fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
}
