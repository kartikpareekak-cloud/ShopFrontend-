import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Mail, 
  Eye, 
  FileText, 
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Package
} from 'lucide-react';
import { AutoFallbackImage } from '@/components/ui/AutoFallbackImage';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  slNo: number;
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  order: {
    orderNumber: string;
    orderDate: string;
    status: string;
    paymentMethod: string;
    isPaid: boolean;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  paymentInfo: any;
  company: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    gstNo: string;
  };
}

const Invoice: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchInvoice();
    }
  }, [orderId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${orderId}`);
      setInvoice(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch invoice:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/invoices/${orderId}/download`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice?.order.orderNumber}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to download invoice",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewing(true);
      const response = await api.get(`/invoices/${orderId}/preview`);
      
      // Open in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
      }
    } catch (error: any) {
      console.error('Failed to preview invoice:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to preview invoice",
        variant: "destructive",
      });
    } finally {
      setPreviewing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested invoice could not be found.</p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invoice</h1>
            <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={previewing}
            className="flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewing ? 'Loading...' : 'Preview'}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{invoice.company.name}</CardTitle>
                  <p className="opacity-90 mt-1">Invoice #{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <Badge variant={invoice.order.isPaid ? "default" : "secondary"} className="mb-2">
                    {invoice.order.isPaid ? 'PAID' : 'PENDING'}
                  </Badge>
                  <p className="text-sm opacity-90">
                    Date: {formatDate(invoice.invoiceDate)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Info */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    From
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{invoice.company.name}</p>
                    <p>{invoice.company.address}</p>
                    <p>{invoice.company.city}</p>
                    <p>{invoice.company.country}</p>
                    <p className="flex items-center mt-2">
                      <Phone className="h-3 w-3 mr-1" />
                      {invoice.company.phone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {invoice.company.email}
                    </p>
                    <p><strong>GST:</strong> {invoice.company.gstNo}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Bill To
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{invoice.customer.name}</p>
                    <p>{invoice.customer.address.street}</p>
                    <p>{invoice.customer.address.city}, {invoice.customer.address.state} {invoice.customer.address.zipCode}</p>
                    <p>{invoice.customer.address.country}</p>
                    <p className="flex items-center mt-2">
                      <Phone className="h-3 w-3 mr-1" />
                      {invoice.customer.phone}
                    </p>
                    {invoice.customer.email && (
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {invoice.customer.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">#</th>
                      <th className="text-left py-3 px-2">Product</th>
                      <th className="text-center py-3 px-2">Qty</th>
                      <th className="text-right py-3 px-2">Unit Price</th>
                      <th className="text-right py-3 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.productId} className="border-b">
                        <td className="py-3 px-2 text-center">{item.slNo}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <AutoFallbackImage
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {item.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">{item.quantity}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 px-2 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(invoice.totals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST 18%):</span>
                  <span>{formatCurrency(invoice.totals.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(invoice.totals.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-mono">{invoice.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{formatDate(invoice.order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {invoice.order.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="flex items-center">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {invoice.order.paymentMethod}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Date:</span>
                <span>{formatDate(invoice.invoiceDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {invoice.paymentInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invoice.paymentInfo.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-sm">{invoice.paymentInfo.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge variant={invoice.order.isPaid ? "default" : "secondary"}>
                    {invoice.order.isPaid ? 'Successfully Paid' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={previewing}
                className="w-full flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewing ? 'Loading...' : 'Preview Invoice'}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download Invoice'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Invoice;