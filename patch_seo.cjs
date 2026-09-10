const fs = require('fs');
let content = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

const seoCode = `
  useEffect(() => {
    if (product) {
      document.title = \`\${product.name} | SwiftStore\`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', product.description.substring(0, 160));
      }
      
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', product.name);
      
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', product.imageUrl);
      
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', window.location.href);
    }
  }, [product]);
`;

// Insert the seoCode after product is loaded.
// There is an existing useEffect, I can just insert it right after the fetchReviews useEffect.
content = content.replace("    fetchReviews();\n  }, [id]);", "    fetchReviews();\n  }, [id]);\n" + seoCode);
fs.writeFileSync('src/pages/store/ProductDetails.tsx', content);
