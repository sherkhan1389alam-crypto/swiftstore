import re

with open('src/pages/store/Checkout.tsx', 'r') as f:
    content = f.read()

content = content.replace("navigate(`/track-order?id=${docRef.id}`);", "navigate(`/track-order?id=${docRef.id}&success=true`);")

with open('src/pages/store/Checkout.tsx', 'w') as f:
    f.write(content)
