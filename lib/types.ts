export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  level: number;
  image: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  url: string;
  path?: string;
  isMain?: boolean;
  sortOrder?: number;
  altText?: string | null;
}

export interface PriceTier {
  id?: string;
  min_quantity: number;
  max_quantity: number | null;
  price: string;
  is_active: boolean;
}

export interface ProductVariation {
  id: string;
  template_id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
  is_active: boolean;
  sort_order: number;
  images: ProductImage[];
  priceTiers: PriceTier[];
}

export interface ProductTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string> | null;
  categories: Category[];
  is_active: boolean;
  is_featured: boolean;
  variations: ProductVariation[];
  created_at: string;
  updated_at: string;
}

export interface BackendCartItem {
  id: string;
  productVariationId: string;
  quantity: number;
  price: number;
  productVariation: ProductVariation;
}

export interface BackendCart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: BackendCartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartItem {
  cartItemId: string;
  variationId: string;
  templateSlug: string;
  name: string;
  material: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface OrderItem {
  id: string;
  productVariationId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | 'processing_payment'
  | 'pending_transfer'
  | 'paid_preparing'
  | 'paid_ready_to_ship'
  | 'paid_shipped'
  | 'paid_delivered'
  | 'cancelled'
  | 'expired'
  | 'refunded';

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  createdAt: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress: string;
  items: OrderItem[];
}

export interface BackendOrder {
  id: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  deliveryMethod?: string | null;
  deliveryAddress?: string | null;
  items: Array<{
    id: string;
    productVariationId: string;
    title: string;
    quantity: number;
    unitPrice: string | number;
    productVariation?: { images?: ProductImage[] } | null;
  }>;
}
