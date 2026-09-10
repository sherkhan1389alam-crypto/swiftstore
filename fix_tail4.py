import re
with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

content = content.replace("          </div>\n        ) : null}\n    </div>\n  );\n}", "          </div>\n      )}\n    </div>\n  );\n}")

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
