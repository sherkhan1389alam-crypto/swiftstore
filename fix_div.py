with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

content = content.replace("</div>\\n                    \\n                    {/* Courier Tracking */}", "</div>\\n                    </div>\\n                    \\n                    {/* Courier Tracking */}")

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
