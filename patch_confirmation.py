import re

with open('src/pages/store/OrderConfirmation.tsx', 'r') as f:
    content = f.read()

pattern = r'export default function OrderConfirmation\(\) \{[\s\S]*?const \[loading, setLoading\] = useState\(true\);'

replacement = """import { useNavigate } from 'react-router-dom';
export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);"""

content = re.sub(r'export default function OrderConfirmation\(\) \{[\s\S]*?const \[loading, setLoading\] = useState\(true\);', replacement, content)

useEffect_pattern = r'useEffect\(\(\) => \{[\s\S]*?fetchOrder\(\);\n  \}, \[id\]\);'

useEffect_replacement = """useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedOrder = { id: docSnap.id, ...docSnap.data() } as Order;
          setOrder(fetchedOrder);
          
          setTimeout(() => {
             navigate(`/track-order?orderId=${fetchedOrder.orderNumber || fetchedOrder.id}`);
          }, 2500);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);"""

content = re.sub(useEffect_pattern, useEffect_replacement, content)

with open('src/pages/store/OrderConfirmation.tsx', 'w') as f:
    f.write(content)

