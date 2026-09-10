import re

with open("src/pages/admin/ProductForm.tsx", "r") as f:
    content = f.read()

old_compress = """          const max_size = 1200;
          
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.8));"""

new_compress = """          const max_size = 800;
          
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Fill white background for transparent images when converting to JPEG
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          // Always use JPEG for aggressive compression to fit within Firestore 1MB document limit
          resolve(canvas.toDataURL('image/jpeg', 0.6));"""

content = content.replace(old_compress, new_compress)

with open("src/pages/admin/ProductForm.tsx", "w") as f:
    f.write(content)

