import fs from 'fs';
let code = fs.readFileSync('src/components/HomeReviews.tsx', 'utf8');

code = code.replace(
  "// Fetch total orders for the \"Happy Customers\" count",
  "try {\n          // Fetch total orders for the \"Happy Customers\" count"
);

code = code.replace(
  "setTotalOrders(orderCount);",
  "setTotalOrders(orderCount);\n        } catch (orderErr) {\n          console.error('Error fetching order count:', orderErr);\n          setTotalOrders(0);\n        }"
);

fs.writeFileSync('src/components/HomeReviews.tsx', code);
