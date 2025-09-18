import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderUpdates } from '@/contexts/SocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { AutoFallbackImage } from '@/components/ui/AutoFallbackImage';
import api from '@/lib/api';

interface Order {
  _id: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    email?: string;
    street?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    pincode?: string;
    country?: string;
  };
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  paymentMethod?: string;
  itemsPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
  total?: number; // Some orders might have this field instead
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        
        // Handle different response formats
        let ordersData = [];
        if (response.data?.success && response.data?.data) {
          ordersData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response && Array.isArray(response)) {
          ordersData = response;
        }
        
        console.log('Orders response:', response.data);
        console.log('Parsed orders:', ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Real-time order updates
  useOrderUpdates(() => {
    if (user) {
      fetchOrders();
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <div className="text-center py-8">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <div className="py-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              When you place your first order, it will appear here.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => {
            // Handle different field names for backward compatibility
            const orderStatus = order.status || order.orderStatus || 'pending';
            const orderItems = order.items || order.orderItems || [];
            const orderTotal = order.total || order.totalPrice || 0;
            
            return (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(orderStatus)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(orderStatus)}
                        {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items ({orderItems.length})</h4>
                      <div className="space-y-3">
                        {orderItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <AutoFallbackImage 
                              src={item.image || '/placeholder.svg'} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                            <p className="font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.shippingAddress?.fullName || order.customerInfo?.name || 'N/A'}</p>
                      <p>{order.shippingAddress?.street || order.shippingAddress?.address || 'N/A'}</p>
                      <p>
                        {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'} {order.shippingAddress?.zipCode || order.shippingAddress?.pincode || 'N/A'}
                      </p>
                      <p>Phone: {order.shippingAddress?.phone || order.customerInfo?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{order.paymentMethod || 'COD'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-bold text-lg">₹{orderTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Track Order Button */}
                  {(orderStatus === 'confirmed' || orderStatus === 'shipped') && (
                    <div className="pt-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Track Package
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
