export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">About SwiftStore</h1>
      <div className="prose prose-slate lg:prose-lg">
        <p>SwiftStore was founded with a simple mission: to provide high-quality products at unbeatable prices, delivered fast to your doorstep.</p>
        <p>We source the best products from reliable suppliers worldwide, ensuring quality and affordability. Our customer support team is always ready to assist you.</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Values</h2>
        <ul>
          <li><strong>Quality First:</strong> We meticulously vet every product in our catalog.</li>
          <li><strong>Customer Centric:</strong> Your satisfaction is our primary goal.</li>
          <li><strong>Transparency:</strong> No hidden fees, clear communication.</li>
        </ul>
      </div>
    </div>
  );
}
