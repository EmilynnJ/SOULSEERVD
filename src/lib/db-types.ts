export type Schema = {
  users: {
    id?: number;
    name: string;
    email: string;
    role?: string;
    balance?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  readers: {
    id?: number;
    userId: number;
    bio?: string | null;
    specialties?: string | null;
    rate: number;
    isOnline?: boolean;
    rating?: number;
    imageUrl?: string | null;
  };
  services: {
    id?: number;
    name: string;
    description?: string | null;
    type: string;
    price?: number | null;
  };
  bookings: {
    id?: number;
    clientId: number;
    readerId: number;
    serviceId: number;
    status: string;
    scheduledTime?: string | null;
    duration?: number | null;
    amount?: number | null;
    createdAt?: string;
  };
  transactions: {
    id?: number;
    userId: number;
    type: string;
    amount: number;
    status: string;
    createdAt?: string;
  };
  orders: {
    id?: number;
    userId: number;
    total: number;
    status: string;
    itemCount: number;
    shippingAddress?: string | null;
    createdAt?: string;
  };
  order_items: {
    id?: number;
    orderId: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
  };
  products: {
    id?: number;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    category: string;
    inventory?: number;
    stripeProductId?: string | null;
    stripePriceId?: string | null;
    createdAt?: string;
  };
  reader_applications: {
    id?: number;
    userId: number;
    name: string;
    email: string;
    phone?: string | null;
    experience: string;
    specialties: string;
    motivation: string;
    status?: string;
    createdAt?: string;
  };
};