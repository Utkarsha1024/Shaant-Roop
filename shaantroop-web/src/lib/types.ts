export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
  categoryId: string;
}

/** Mirrors the Spring Boot UserDTO */
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

/** Mirrors the Spring Boot AuthResponse */
export interface AuthResponse {
  token: string;
  user: UserDTO;
}

/** Mirrors the Spring Boot UserProfileDTO */
export interface UserProfileDTO {
  fullName: string | null;
  altContactEmail: string | null;
  primaryShippingAddress: string | null;
}

/** Mirrors Spring Boot OrderItemDTO */
export interface OrderItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
}

/** Mirrors Spring Boot OrderDTO */
export interface OrderDTO {
  id: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: string;
  subTotal: number;
  shippingCost: number;
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: OrderItemDTO[];
  createdAt: string;
  updatedAt: string;
}
