import { Role, OrderStatus, PaymentStatus, InventoryChangeType } from '@prisma/client';

export { Role, OrderStatus, PaymentStatus, InventoryChangeType };

export interface IProduct {
  ProductID: string;
  ProductName: string;
  PathImage?: string | null;
  ProductType: string;
  Quantity: number;
  Unit: string;
  Price: number;
  Description?: string | null;
  CreateDate: Date;
  UpdateDate: Date;
  roastLevel?: string | null;
  flavorNotes?: string | null;
  origin?: string | null;
  isFeatured?: boolean;
  categoryId?: string | null;
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrder {
  id: string;
  orderCode: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  note?: string | null;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  items?: IOrderItem[];
}

