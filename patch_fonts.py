import re

with open("index.html", "r") as f:
    html = f.read()
html = re.sub(
    r'<link href="https://fonts.googleapis.com/css2\?family=Inter[^"]*" rel="stylesheet" />',
    '<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />',
    html
)
with open("index.html", "w") as f:
    f.write(html)

with open("src/index.css", "r") as f:
    css = f.read()
css = css.replace("--font-sans: 'Inter'", "--font-sans: 'Manrope'")
css = css.replace("font-family: 'Inter'", "font-family: 'Manrope'")
css = css.replace("background-color: #F1F5F9;", "background-color: #FAFAFA;")
with open("src/index.css", "w") as f:
    f.write(css)

