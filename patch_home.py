import re

with open("src/pages/store/Home.tsx", "r") as f:
    content = f.read()

# Add HeroBanner import
content = content.replace(
    "import { Product } from '../../lib/types';",
    "import { Product, HeroBanner } from '../../lib/types';"
)

# Add banners state
content = content.replace(
    "const [dealProducts, setDealProducts] = useState<Product[]>([]);",
    "const [dealProducts, setDealProducts] = useState<Product[]>([]);\n  const [banners, setBanners] = useState<HeroBanner[]>([]);"
)

# Add banners fetching
content = content.replace(
    "const fetchHomeData = async () => {\n      try {",
    "const fetchHomeData = async () => {\n      try {\n        const bannerQ = query(collection(db, 'heroBanners'), where('status', '==', 'ENABLED'));\n        const bannerSnap = await getDocs(bannerQ);\n        const fetchedBanners = bannerSnap.docs.map(d => ({ id: d.id, ...d.data() } as HeroBanner));\n        fetchedBanners.sort((a, b) => (a.order || 0) - (b.order || 0));\n        setBanners(fetchedBanners);"
)

with open("src/pages/store/Home.tsx", "w") as f:
    f.write(content)
