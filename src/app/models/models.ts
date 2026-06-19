export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  tags: string[];
  isAvailable: boolean;
}

export interface Reservation {
  id?: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id?: number;
  customerName: string;
  customerContact: string;
  items: CartItem[];
  totalAmount: number;
  status?: string;
  notes?: string;
  createdAt?: string;
}

export interface OtpRequest {
  success: boolean;
  message: string;
  customerName: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token: string;
  customerName: string;
  contact: string;
  reservationDate: string;
  reservationTime: string;
}
