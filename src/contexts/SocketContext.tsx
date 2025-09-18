import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectedUsers: number;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  // Safely get auth context
  let auth = null;
  let user = null;
  let token = null;
  
  try {
    auth = useAuth();
    user = auth?.user;
    token = auth?.token;
  } catch (error) {
    console.warn('Auth context not available:', error);
  }
  
  let toast;
  try {
    toast = useToast().toast;
  } catch (error) {
    console.warn('Toast context not available:', error);
    toast = () => {}; // Fallback function
  }

  useEffect(() => {
    // Only connect if user is authenticated and auth context is available
    if (user && token) {
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5004', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
        setSocket(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast({
          title: "Connection Error",
          description: "Unable to connect to real-time updates",
          variant: "destructive",
        });
      });

      // Listen for user count updates
      newSocket.on('user_count_update', (count: number) => {
        setConnectedUsers(count);
      });

      // Listen for online users list
      newSocket.on('online_users_update', (users: string[]) => {
        setOnlineUsers(users);
      });

      // Listen for system notifications
      newSocket.on('system_notification', (notification: any) => {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default',
        });
      });

      // Product update notifications
      newSocket.on('product_updated', (data: any) => {
        toast({
          title: "Product Updated",
          description: `${data.productName} has been updated`,
        });
        // Trigger a refetch of products if needed
        window.dispatchEvent(new CustomEvent('product-updated', { detail: data }));
      });

      // New product notifications
      newSocket.on('product_created', (data: any) => {
        toast({
          title: "New Product Added",
          description: `${data.productName} is now available`,
        });
        window.dispatchEvent(new CustomEvent('product-created', { detail: data }));
      });

      // Product deleted notifications
      newSocket.on('product_deleted', (data: any) => {
        toast({
          title: "Product Removed",
          description: `${data.productName} is no longer available`,
          variant: "destructive",
        });
        window.dispatchEvent(new CustomEvent('product-deleted', { detail: data }));
      });

      // Order status update notifications
      newSocket.on('order_status_updated', (data: any) => {
        toast({
          title: "Order Status Updated",
          description: `Order #${data.orderNumber} is now ${data.status}`,
        });
        window.dispatchEvent(new CustomEvent('order-status-updated', { detail: data }));
      });

      // New order notifications (for admin)
      newSocket.on('new_order', (data: any) => {
        if (user?.role === 'admin') {
          toast({
            title: "New Order Received",
            description: `Order #${data.orderNumber} from ${data.customerName}`,
          });
          window.dispatchEvent(new CustomEvent('new-order', { detail: data }));
        }
      });

      // Inventory low stock alerts
      newSocket.on('low_stock_alert', (data: any) => {
        if (user?.role === 'admin') {
          toast({
            title: "Low Stock Alert",
            description: `${data.productName} has only ${data.quantity} items left`,
            variant: "destructive",
          });
        }
      });

      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect socket if user logs out or auth is not available
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token, toast]);

  const value = {
    socket,
    isConnected,
    connectedUsers,
    onlineUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Helper hook for real-time product updates
export const useProductUpdates = (onProductUpdate?: (data: any) => void) => {
  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent) => {
      onProductUpdate?.(event.detail);
    };

    const handleProductCreated = (event: CustomEvent) => {
      onProductUpdate?.(event.detail);
    };

    const handleProductDeleted = (event: CustomEvent) => {
      onProductUpdate?.(event.detail);
    };

    window.addEventListener('product-updated', handleProductUpdate as EventListener);
    window.addEventListener('product-created', handleProductCreated as EventListener);
    window.addEventListener('product-deleted', handleProductDeleted as EventListener);

    return () => {
      window.removeEventListener('product-updated', handleProductUpdate as EventListener);
      window.removeEventListener('product-created', handleProductCreated as EventListener);
      window.removeEventListener('product-deleted', handleProductDeleted as EventListener);
    };
  }, [onProductUpdate]);
};

// Helper hook for real-time order updates
export const useOrderUpdates = (onOrderUpdate?: (data: any) => void) => {
  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent) => {
      onOrderUpdate?.(event.detail);
    };

    const handleNewOrder = (event: CustomEvent) => {
      onOrderUpdate?.(event.detail);
    };

    window.addEventListener('order-status-updated', handleOrderUpdate as EventListener);
    window.addEventListener('new-order', handleNewOrder as EventListener);

    return () => {
      window.removeEventListener('order-status-updated', handleOrderUpdate as EventListener);
      window.removeEventListener('new-order', handleNewOrder as EventListener);
    };
  }, [onOrderUpdate]);
};

export default SocketContext;