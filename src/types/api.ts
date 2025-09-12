// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Payment API Types
export interface PaymentOrderResponse {
  orderId: string;
  paymentSessionId: string;
  amount: number;
}

export interface PaymentVerifyResponse {
  orderId: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CODOrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}
