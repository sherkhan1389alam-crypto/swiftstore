#!/bin/bash
sed -i 's/estimatedDeliveryDate: addDeliveryDays(Date.now(), settings?.shippingSettings?.standardDeliveryDays || 7, settings?.shippingSettings?.countWeekendsInDelivery ?? true),/estimatedDeliveryDate: Date.now() + (7 * 24 * 60 * 60 * 1000),/g' src/pages/store/Checkout.tsx
sed -i 's/shippingDeliveryDays: settings?.shippingSettings?.standardDeliveryDays || 7/shippingDeliveryDays: 7/g' src/pages/store/Checkout.tsx
