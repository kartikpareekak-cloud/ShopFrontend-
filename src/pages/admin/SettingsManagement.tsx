import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Settings as SettingsIcon,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Truck,
  Bell
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import api from '@/lib/api';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  business: {
    gst: string;
    pan: string;
    businessName: string;
    businessType: string;
  };
  payment: {
    razorpayEnabled: boolean;
    razorpayKeyId: string;
    razorpayKeySecret: string;
    codEnabled: boolean;
    minOrderAmount: number;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
    estimatedDelivery: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    promotionalEmails: boolean;
  };
}

const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Panditji Auto Connect',
    siteDescription: 'Your one-stop shop for automotive parts and accessories',
    siteUrl: 'https://panditji-auto-connect.com',
    contactEmail: 'info@panditji-auto-connect.com',
    contactPhone: '+91 9876543210',
    address: '123 Auto Street, Car City, State 12345',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    seo: {
      metaTitle: 'Panditji Auto Connect - Premium Auto Parts',
      metaDescription: 'Discover premium automotive parts and accessories at Panditji Auto Connect. Quality parts, competitive prices, fast delivery.',
      keywords: 'auto parts, car accessories, automotive, vehicle parts'
    },
    business: {
      gst: '',
      pan: '',
      businessName: 'Panditji Auto Connect Pvt Ltd',
      businessType: 'E-commerce'
    },
    payment: {
      razorpayEnabled: false,
      razorpayKeyId: '',
      razorpayKeySecret: '',
      codEnabled: true,
      minOrderAmount: 500
    },
    shipping: {
      freeShippingThreshold: 999,
      standardShippingCost: 99,
      expressShippingCost: 199,
      estimatedDelivery: '3-5 business days'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotionalEmails: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      if (response.settings) {
        setSettings({ ...settings, ...response.settings });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use default settings if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('http://localhost:5004/api/admin/settings', settings);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  };

  const updateMainSetting = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings Management</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <SettingsIcon className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="business">
            <Shield className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="mr-2 h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateMainSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateMainSetting('siteUrl', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateMainSetting('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => updateMainSetting('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateMainSetting('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateMainSetting('address', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia.facebook}
                      onChange={(e) => updateSettings('socialMedia', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia.instagram}
                      onChange={(e) => updateSettings('socialMedia', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialMedia.twitter}
                      onChange={(e) => updateSettings('socialMedia', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={settings.socialMedia.youtube}
                      onChange={(e) => updateSettings('socialMedia', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.seo.metaDescription}
                  onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  value={settings.seo.keywords}
                  onChange={(e) => updateSettings('seo', 'keywords', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.business.businessName}
                    onChange={(e) => updateSettings('business', 'businessName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={settings.business.businessType}
                    onChange={(e) => updateSettings('business', 'businessType', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={settings.business.gst}
                    onChange={(e) => updateSettings('business', 'gst', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={settings.business.pan}
                    onChange={(e) => updateSettings('business', 'pan', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Razorpay Configuration</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="razorpayEnabled"
                    checked={settings.payment.razorpayEnabled}
                    onCheckedChange={(checked) => updateSettings('payment', 'razorpayEnabled', checked)}
                  />
                  <Label htmlFor="razorpayEnabled">Enable Razorpay</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                    <Input
                      id="razorpayKeyId"
                      value={settings.payment.razorpayKeyId}
                      onChange={(e) => updateSettings('payment', 'razorpayKeyId', e.target.value)}
                      disabled={!settings.payment.razorpayEnabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                    <Input
                      id="razorpayKeySecret"
                      type="password"
                      value={settings.payment.razorpayKeySecret}
                      onChange={(e) => updateSettings('payment', 'razorpayKeySecret', e.target.value)}
                      disabled={!settings.payment.razorpayEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Cash on Delivery</h4>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="codEnabled"
                    checked={settings.payment.codEnabled}
                    onCheckedChange={(checked) => updateSettings('payment', 'codEnabled', checked)}
                  />
                  <Label htmlFor="codEnabled">Enable Cash on Delivery</Label>
                </div>
                <div>
                  <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={settings.payment.minOrderAmount}
                    onChange={(e) => updateSettings('payment', 'minOrderAmount', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => updateSettings('shipping', 'freeShippingThreshold', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="standardShippingCost">Standard Shipping Cost (₹)</Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    value={settings.shipping.standardShippingCost}
                    onChange={(e) => updateSettings('shipping', 'standardShippingCost', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="expressShippingCost">Express Shipping Cost (₹)</Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    value={settings.shipping.expressShippingCost}
                    onChange={(e) => updateSettings('shipping', 'expressShippingCost', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDelivery">Estimated Delivery Time</Label>
                  <Input
                    id="estimatedDelivery"
                    value={settings.shipping.estimatedDelivery}
                    onChange={(e) => updateSettings('shipping', 'estimatedDelivery', e.target.value)}
                    placeholder="3-5 business days"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'smsNotifications', checked)}
                  />
                  <Label htmlFor="smsNotifications">Enable SMS Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="orderUpdates"
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => updateSettings('notifications', 'orderUpdates', checked)}
                  />
                  <Label htmlFor="orderUpdates">Send Order Status Updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="promotionalEmails"
                    checked={settings.notifications.promotionalEmails}
                    onCheckedChange={(checked) => updateSettings('notifications', 'promotionalEmails', checked)}
                  />
                  <Label htmlFor="promotionalEmails">Send Promotional Emails</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
