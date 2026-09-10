import re

with open('src/pages/store/Checkout.tsx', 'r') as f:
    content = f.read()

content = content.replace("navigate(`/order-confirmation/${docRef.id}`);", "navigate(`/track-order?id=${docRef.id}`);")

with open('src/pages/store/Checkout.tsx', 'w') as f:
    f.write(content)
