with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

content = content.replace("Instagram,", "")
content = content.replace("Facebook,", "")
content = content.replace("Youtube,", "")

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)
