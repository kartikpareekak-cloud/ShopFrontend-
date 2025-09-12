// Global type definitions for the project

declare global {
  interface Window {
    Cashfree: {
      checkout: (options: {
        paymentSessionId: string;
        returnUrl: string;
        redirectTarget?: string;
      }) => Promise<{
        error?: {
          message: string;
          type: string;
        };
        paymentDetails?: {
          paymentMessage: string;
          transactionId: string;
        };
      }>;
    };
  }
}

// Order Status Types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

// Error Boundary Types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

// Component Props Types
export interface PropsWithChildren {
  children: React.ReactNode;
}

export interface ProtectedRouteProps extends PropsWithChildren {
  requireAdmin?: boolean;
}

export interface AuthProviderProps extends PropsWithChildren {}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: {
    url: string;
    alt: string;
  };
  images?: Array<{
    url: string;
    alt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Image Component Types
export interface AutoFallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export interface OptimizedImageProps extends AutoFallbackImageProps {
  width?: number;
  height?: number;
  priority?: boolean;
}

export {};
