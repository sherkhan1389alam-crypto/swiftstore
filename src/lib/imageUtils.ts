export const compressImage = (file: File, preserveTransparency: boolean = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 600; // Reduced to fit within Firestore 1MB limits
        
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
        
        if (ctx) {
          if (preserveTransparency || file.type === 'image/png' || file.type === 'image/webp') {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/webp', 0.8)); // WebP supports transparency and compression
          } else {
            // Fill white background for transparent images when converting to JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          }
        } else {
          resolve(img.src);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
