sed -i 's/cost: i.cost,/cost: i.cost || 0,/g' src/pages/store/Checkout.tsx
sed -i 's/shippingCost: i.shippingCost,/shippingCost: i.shippingCost || 0,/g' src/pages/store/Checkout.tsx
sed -i 's/paymentFee: i.paymentFee,/paymentFee: i.paymentFee || 0,/g' src/pages/store/Checkout.tsx
sed -i 's/otherCost: i.otherCost/otherCost: i.otherCost || 0/g' src/pages/store/Checkout.tsx
