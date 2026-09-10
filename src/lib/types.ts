export interface ProductVariant {
  id: string;
  name: string; // e.g. "XL", "Red"
  sku?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  inventoryTracking?: boolean;
  imageUrl?: string;
}

export interface Product {
  slug?: string;
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
}
export interface Category {
  id: string;
  orderNumber?: string;
  name: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  status?: 'ENABLED' | 'DISABLED';
  order?: number;
  featured?: boolean;
}
export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED' | 'REFUND_INITIATED' | 'REFUNDED';
export interface OrderStatusHistory {
  status: OrderStatus;
  statusHistory?: OrderStatusHistory[];
  estimatedDeliveryDate?: number;
  courierName?: string;
  shippingCharge?: number;
  codCharge?: number;
  date: number;
  note?: string;
}

export interface Order {
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
    imageUrl?: string;
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
  estimatedDeliveryDate?: number;
  shippingDeliveryDays?: number;
  shippedAt?: number;
  outForDeliveryAt?: number;
  deliveredAt?: number;
  cancelledAt?: number;
  courierName?: string;
  paymentStatus: 'PENDING' | 'PENDING_VERIFICATION' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentMethod?: 'ONLINE' | 'COD' | 'DIRECT_UPI';
  supplierOrderId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: number;
}

export interface HeroBanner {
  id: string;
  imageUrl: string;
  desktopImageUrl?: string;
  tabletImageUrl?: string;
  mobileImageUrl?: string;
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  status: 'ENABLED' | 'DISABLED';
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userLocation?: string;
  rating: number;
  title?: string;
  text: string;
  imageUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  adminReply?: string;
  createdAt: number;
  updatedAt?: number;
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  isBlocked?: boolean;
  createdAt: number;
}