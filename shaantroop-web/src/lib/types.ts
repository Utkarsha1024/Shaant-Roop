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
  discontinued?: boolean;
}

export interface DashboardStatsResponseDTO {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  totalProducts: number;
  totalCategories: number;
  salesOverTime: Array<{
    date: string;
    revenue: number;
  }>;
  ageDemographics: Record<string, number>;
  stateDistribution: Record<string, number>;
  categoryMetrics: Array<{
    categoryName: string;
    productCount: number;
    totalRevenue: number;
  }>;
  topSellingProducts: Array<{
    productName: string;
    quantitySold: number;
  }>;
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

/** Mirrors the Spring Boot UserProfileRequestDTO */
export interface UserProfileRequestDTO {
  fullName: string;
  altContactEmail: string | null;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  dateOfBirth: string | null;
  country: string;
}

/** Mirrors the Spring Boot UserProfileResponseDTO */
export interface UserProfileResponseDTO {
  fullName: string | null;
  altContactEmail: string | null;
  phone: string | null;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  dateOfBirth: string | null;
  country: string | null;
}

/** Mirrors Spring Boot OrderItemDTO */
export interface OrderItemDTO {
  id: number;
  productId: number | null;
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

/** Mirrors the Spring Boot Course entity */
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
}
