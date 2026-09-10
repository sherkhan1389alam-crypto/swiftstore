import re

with open('src/pages/store/MyOrders.tsx', 'r') as f:
    content = f.read()

# Change Track Order to VIEW ORDER
content = content.replace('>Track Order</Link>', '>VIEW ORDER</Link>')
content = content.replace("order.status.replace('_', ' ')", "order.status.replace(/_/g, ' ')")

with open('src/pages/store/MyOrders.tsx', 'w') as f:
    f.write(content)
