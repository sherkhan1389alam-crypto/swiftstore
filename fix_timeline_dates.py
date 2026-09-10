import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

# Fix Out for Delivery
old_out = r"\{order\.outForDeliveryAt \? format\(new Date\(order\.outForDeliveryAt\), 'dd MMM'\) : \(currentStatusIndex >= 2 \? 'Estimated ' \+ format\(new Date\(order\.estimatedDeliveryDate!\), 'dd MMM'\) : 'Pending'\)\}"
new_out = r"{order.outForDeliveryAt ? format(new Date(order.outForDeliveryAt), 'dd MMM') : ('Estimated ' + format(new Date(order.estimatedDeliveryDate!), 'dd MMM'))}"
content = re.sub(old_out, new_out, content)

# Fix Delivered
old_del = r"\{order\.deliveredAt[\s\S]*?\? format\(new Date\(order\.deliveredAt\), 'dd MMM'\)[\s\S]*?: \(currentStatusIndex >= 2 \? 'Estimated ' \+ format\(new Date\(order\.estimatedDeliveryDate!\), 'dd MMM'\) : 'Pending'\)[\s\S]*?\}"
new_del = r"{order.deliveredAt ? format(new Date(order.deliveredAt), 'dd MMM') : ('Estimated ' + format(new Date(order.estimatedDeliveryDate!), 'dd MMM'))}"
content = re.sub(old_del, new_del, content)

# Fix Confirmed to not say Pending, but just not have a date unless confirmed, wait, the prompt says:
# ✓ Ordered - 07 Sep
# ✓ Confirmed - 07 Sep  (wait, if it's not confirmed, it should just be empty or say Pending)
# The prompt says: "✓ Ordered - 7 Sep | ○ Confirmed | ○ Shipped"

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)

