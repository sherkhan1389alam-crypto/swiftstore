import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

content = content.replace("{currentStatusIndex >= 1 ? format(new Date(order.createdAt), 'dd MMM') : 'Pending'}", "{currentStatusIndex >= 1 ? format(new Date(order.createdAt), 'dd MMM') : ''}")
content = content.replace("{order.shippedAt ? format(new Date(order.shippedAt), 'dd MMM') : 'Pending'}", "{order.shippedAt ? format(new Date(order.shippedAt), 'dd MMM') : ''}")

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
