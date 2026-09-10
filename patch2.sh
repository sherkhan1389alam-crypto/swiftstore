sed -i 's/productId: i.id,/productId: i.id,\n          selectedVariants: i.selectedVariants || null,/g' src/pages/store/Checkout.tsx
