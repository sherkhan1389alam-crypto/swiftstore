#!/bin/bash
sed -i 's/setDeliveryStatus('\''AVAILABLE'\'');/setDeliveryStatus('\''AVAILABLE'\'');/g' src/pages/store/ProductDetails.tsx
