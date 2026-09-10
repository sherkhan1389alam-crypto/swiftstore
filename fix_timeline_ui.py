import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

content = content.replace('-left-[21px] md:-left-[37px]', '-left-[27px] md:-left-[45px]')

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(content)
