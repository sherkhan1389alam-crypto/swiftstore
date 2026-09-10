with open("src/pages/store/Home.tsx", "r") as f:
    lines = f.readlines()

lines[0] = "import { useState, useEffect } from 'react';\n"
lines.insert(1, "import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';\n")
lines.insert(2, "import { db } from '../../lib/firebase';\n")
lines.insert(3, "import { Product } from '../../lib/types';\n")
lines.insert(4, "import { useCart } from '../../contexts/CartContext';\n")
lines.insert(5, "import { Link, useNavigate } from 'react-router-dom';\n")
lines.insert(6, "import { Loader2, ShoppingCart, ShieldCheck, Truck, HeadphonesIcon, Lock, Heart, Star, Camera, RefreshCw, ArrowRight, Grid } from 'lucide-react';\n")

with open("src/pages/store/Home.tsx", "w") as f:
    f.writelines(lines)
