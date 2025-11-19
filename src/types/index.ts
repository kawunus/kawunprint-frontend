export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  telegramAccount?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT' | 'ANALYST';
  isActive: boolean;
}

export interface Order {
  id: number;
  customer: User;
  employee?: User;
  status: string;
  statusId?: number;
  totalPrice: number;
  createdAt: string;
  completedAt?: string;
  comment?: string;
}

export interface OrderHistory {
  id: number;
  status?: string;
  statusId?: number;
  employee: User;
  comment?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  telegramAccount?: string;
}

export interface CreateOrderRequest {
  comment: string;
  files?: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
