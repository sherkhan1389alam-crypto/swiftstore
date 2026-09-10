#!/bin/bash
mkdir -p src/pages/store src/pages/admin

# Store pages
for page in Home Shop Categories ProductDetails Cart Checkout OrderConfirmation TrackOrder Login Profile MyOrders Search; do
  echo "export default function $page() { return <div className=\"p-8 max-w-7xl mx-auto\"><h1 className=\"text-3xl font-bold\">$page</h1></div>; }" > "src/pages/store/$page.tsx"
done

# Admin pages
for page in Dashboard Orders Products Categories Customers; do
  echo "export default function $page() { return <div><h1 className=\"text-2xl font-bold mb-6\">$page</h1></div>; }" > "src/pages/admin/$page.tsx"
done
