import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

// I will just append the missing properties to the Product interface
if (!code.includes('lowStockThreshold?: number;')) {
  code = code.replace(
    /stock\?: number;/,
    `stock?: number;
  lowStockThreshold?: number;
  inventoryTracking?: boolean;`
  );
}

// Ensure it applies to Product, not ProductVariant (which might also have stock?: number;)
// Let's just do a manual string replace of the entire Product interface
let replacement = `export interface Product {
  id: string;
  sku?: string;
  orderNumber?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  cost: number;
  shippingCost?: number;
  paymentFee?: number;
  otherCost?: number;
  estimatedProfit?: number;
  sourceUrl?: string;
  sourceId?: string;
  sourceName?: string;
  imageUrl: string;
  images?: string[];
  categoryId: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  specifications?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  variantOptions?: { name: string; options: string[] }[];
  stock?: number;
  lowStockThreshold?: number;
  inventoryTracking?: boolean;
  status?: 'PUBLISHED' | 'DRAFT' | 'OUT_OF_STOCK' | 'DISABLED';
  createdAt: number;
  updatedAt?: number;
}`;

code = code.replace(/export interface Product \{[\s\S]*?updatedAt\?: number;\n\}/, replacement);

let orderReplacement = `export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    houseNo: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    name?: string;
    quantity: number;
    price: number;
    cost?: number;
    shippingCost?: number;
    paymentFee?: number;
    otherCost?: number;
  }>;
  total: number;
  shippingCharge?: number;
  discount?: number;
  tax?: number;
  adminNote?: string;
  customerNote?: string;
  status: OrderStatus;
  statusHistory?: OrderStatusHistory[];
  expectedDeliveryDate?: number;
  courierName?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentMethod?: 'ONLINE' | 'COD';
  supplierOrderId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: number;
}`;

code = code.replace(/export interface Order \{[\s\S]*?createdAt: number;\n\}/, orderReplacement);

fs.writeFileSync('src/lib/types.ts', code);
