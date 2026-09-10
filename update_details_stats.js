import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

// replace 24 reviews
const target1 = `<span className="text-sm font-semibold text-slate-500 underline decoration-slate-300 cursor-pointer hover:text-slate-900 transition-colors">24 Reviews</span>`;
const target2 = `const [activeImage, setActiveImage] = useState<string>('');`;

if (!code.includes('reviewStats')) {
  code = code.replace(
    "import { doc, getDoc } from 'firebase/firestore';",
    "import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';"
  );
  
  code = code.replace(
    target2,
    target2 + "\n  const [reviewStats, setReviewStats] = useState({ count: 0, average: 0 });"
  );
  
  const fetchReviewsBlock = `
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const q = query(
          collection(db, 'reviews'),
          where('productId', '==', id),
          where('status', '==', 'APPROVED')
        );
        const snapshot = await getDocs(q);
        const count = snapshot.docs.length;
        if (count > 0) {
          const totalRating = snapshot.docs.reduce((sum, d) => sum + d.data().rating, 0);
          setReviewStats({ count, average: totalRating / count });
        }
      } catch (error) {
        console.error("Error loading reviews", error);
      }
    };
    fetchReviews();
`;
  
  code = code.replace("window.scrollTo(0, 0);", fetchReviewsBlock + "    window.scrollTo(0, 0);");
  
  code = code.replace(
    "{[1, 2, 3, 4, 5].map((s) => (\n                    <Star key={s} className=\"h-4 w-4 fill-slate-900 text-slate-900\" />\n                  ))}",
    "{[1, 2, 3, 4, 5].map((s) => (\n                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(reviewStats.average || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />\n                  ))}"
  );
  
  code = code.replace(
    target1,
    "{reviewStats.count > 0 ? (\n                  <span className=\"text-sm font-semibold text-slate-500 underline decoration-slate-300 cursor-pointer hover:text-slate-900 transition-colors\"\n                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>\n                    {reviewStats.count} Review{reviewStats.count !== 1 && 's'}\n                  </span>\n                ) : (\n                  <span className=\"text-sm font-semibold text-slate-500\">No reviews yet</span>\n                )}"
  );
  
  fs.writeFileSync('src/pages/store/ProductDetails.tsx', code);
}
