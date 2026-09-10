import fs from 'fs';
let code = fs.readFileSync('src/components/ProductReviews.tsx', 'utf8');

const updatedSubmit = `
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setSubmitting(true);
    try {
      const reviewData = {
        productId,
        productName,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Customer',
        rating,
        text: reviewText,
        imageUrl: reviewImage,
        status: 'APPROVED', // Auto-approve for demo
        isVerifiedPurchase: hasPurchased,
        isFeatured: false,
        createdAt: Date.now()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      setReviews([{ id: docRef.id, ...reviewData } as Review, ...reviews]);
      setShowForm(false);
      setRating(5);
      setReviewText('');
      setReviewImage('');
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };
`;

code = code.replace(
  /const handleSubmitReview = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*\};\n/,
  updatedSubmit
);

fs.writeFileSync('src/components/ProductReviews.tsx', code);
