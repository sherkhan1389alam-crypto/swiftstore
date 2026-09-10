import re
with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'</div>\s*\{/\* Courier Tracking \*/\}', '</div>\\n                    </div>\\n                )}\\n            </div>\\n\\n            {/* Courier Tracking */}', content)

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
