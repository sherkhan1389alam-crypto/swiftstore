const fs = require('fs');
let content = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');

const validationLogic = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    setSubmitting(true);
`;

content = content.replace(`  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setSubmitting(true);`, validationLogic);

fs.writeFileSync('src/pages/store/Checkout.tsx', content);
