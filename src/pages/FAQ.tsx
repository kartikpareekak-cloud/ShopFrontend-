import React, { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 'shipping-1',
      question: 'What are your shipping charges and delivery times?',
      answer: 'We offer free shipping on orders above ₹999. For orders below ₹999, shipping charges start from ₹49. Delivery typically takes 2-5 business days depending on your location. Metro cities receive faster delivery (2-3 days) while remote areas may take up to 5-7 days.',
      category: 'shipping',
      tags: ['shipping', 'delivery', 'charges', 'free shipping']
    },
    {
      id: 'shipping-2',
      question: 'Do you deliver to all parts of India?',
      answer: 'Yes, we deliver to all serviceable pin codes across India. During checkout, you can verify if your pin code is serviceable. We partner with reliable courier services to ensure safe delivery to your doorstep.',
      category: 'shipping',
      tags: ['delivery', 'India', 'pin code', 'serviceable']
    },
    {
      id: 'products-1',
      question: 'Are your auto parts genuine and authentic?',
      answer: 'Absolutely! We source all our products directly from authorized dealers and manufacturers. Every product comes with proper documentation and warranty. We offer both OEM (Original Equipment Manufacturer) and high-quality aftermarket parts.',
      category: 'products',
      tags: ['genuine', 'authentic', 'OEM', 'warranty', 'quality']
    },
    {
      id: 'products-2',
      question: 'How do I find the right part for my vehicle?',
      answer: 'You can search by vehicle make, model, and year using our advanced search feature. Alternatively, contact our technical experts with your vehicle registration number or chassis number, and we\'ll help you find the exact parts you need.',
      category: 'products',
      tags: ['vehicle', 'search', 'compatibility', 'technical support']
    },
    {
      id: 'products-3',
      question: 'Do you provide installation services?',
      answer: 'While we don\'t provide direct installation services, we can recommend certified mechanics and service centers in your area. We also provide detailed installation guides and technical support via phone or email.',
      category: 'products',
      tags: ['installation', 'service', 'mechanics', 'technical support']
    },
    {
      id: 'orders-1',
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking number via SMS and email. You can track your order in real-time using this tracking number on our website or the courier partner\'s website.',
      category: 'orders',
      tags: ['tracking', 'order status', 'shipping', 'SMS', 'email']
    },
    {
      id: 'orders-2',
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been processed for shipping. Contact our customer support immediately for any changes. Once shipped, orders cannot be modified.',
      category: 'orders',
      tags: ['cancel', 'modify', 'order', 'customer support']
    },
    {
      id: 'returns-1',
      question: 'What is your return and exchange policy?',
      answer: 'We offer a 7-day return policy for manufacturing defects and wrong items delivered. Products must be in original packaging and unused condition. Return shipping is free for our mistakes, while customer convenience returns may attract shipping charges.',
      category: 'returns',
      tags: ['return', 'exchange', 'policy', 'defects', 'packaging']
    },
    {
      id: 'returns-2',
      question: 'How do I initiate a return or exchange?',
      answer: 'To initiate a return, go to "My Orders" section in your account, select the order, and click "Return Item". Fill out the return form with reason and photos if applicable. Our team will review and approve eligible returns within 24 hours.',
      category: 'returns',
      tags: ['return process', 'exchange', 'my orders', 'photos']
    },
    {
      id: 'payment-1',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including Credit/Debit Cards, Net Banking, UPI, Digital Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD). All payments are processed securely through Razorpay.',
      category: 'payment',
      tags: ['payment', 'credit card', 'UPI', 'COD', 'secure', 'Razorpay']
    },
    {
      id: 'payment-2',
      question: 'Is Cash on Delivery (COD) available?',
      answer: 'Yes, COD is available for orders up to ₹5,000 in most serviceable areas. COD charges of ₹49 apply for orders below ₹999. Some remote locations may not have COD facility due to courier partner limitations.',
      category: 'payment',
      tags: ['COD', 'cash on delivery', 'charges', 'limitations']
    },
    {
      id: 'warranty-1',
      question: 'What warranty do you provide on auto parts?',
      answer: 'Warranty varies by product and manufacturer. Genuine OEM parts typically come with 6-12 months warranty, while aftermarket parts have 3-6 months warranty. Warranty terms are clearly mentioned on each product page.',
      category: 'warranty',
      tags: ['warranty', 'OEM', 'aftermarket', 'months', 'terms']
    },
    {
      id: 'account-1',
      question: 'How do I create an account and manage my profile?',
      answer: 'Click on "Register" in the top menu, fill in your details, and verify your email. Once registered, you can manage your profile, addresses, orders, and wishlist from the "My Account" section.',
      category: 'account',
      tags: ['register', 'account', 'profile', 'email verification', 'wishlist']
    },
    {
      id: 'technical-1',
      question: 'Do you provide technical support for product selection?',
      answer: 'Yes! Our technical experts are available Monday to Saturday, 9 AM to 7 PM to help you choose the right parts. You can reach us via phone, email, or live chat for personalized assistance.',
      category: 'technical',
      tags: ['technical support', 'product selection', 'experts', 'phone', 'chat']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: faqData.length },
    { id: 'shipping', name: 'Shipping & Delivery', count: faqData.filter(f => f.category === 'shipping').length },
    { id: 'products', name: 'Products & Quality', count: faqData.filter(f => f.category === 'products').length },
    { id: 'orders', name: 'Orders & Tracking', count: faqData.filter(f => f.category === 'orders').length },
    { id: 'returns', name: 'Returns & Exchange', count: faqData.filter(f => f.category === 'returns').length },
    { id: 'payment', name: 'Payment & Pricing', count: faqData.filter(f => f.category === 'payment').length },
    { id: 'warranty', name: 'Warranty & Support', count: faqData.filter(f => f.category === 'warranty').length },
    { id: 'account', name: 'Account Management', count: faqData.filter(f => f.category === 'account').length },
    { id: 'technical', name: 'Technical Support', count: faqData.filter(f => f.category === 'technical').length }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | Panditji Auto Connect</title>
        <meta 
          name="description" 
          content="Find answers to frequently asked questions about auto parts, shipping, returns, payments, and more at Panditji Auto Connect." 
        />
        <meta name="keywords" content="FAQ, auto parts questions, shipping policy, return policy, warranty, technical support" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find quick answers to common questions about our products, services, and policies.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Still Need Help?</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/contact')}
                    className="w-full"
                    variant="outline"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      +91-XXXXXXXXXX
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      support@panditjiautoconnect.com
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              {filteredFAQs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No FAQs Found</h3>
                      <p>Try adjusting your search terms or browse different categories.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleExpanded(faq.id)}
                          className="w-full text-left p-6 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            {expandedItems.includes(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        
                        {expandedItems.includes(faq.id) && (
                          <div className="px-6 pb-6">
                            <div className="border-t pt-4">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Popular Questions */}
              {searchTerm === '' && selectedCategory === 'all' && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Popular Questions</CardTitle>
                    <CardDescription>
                      Most frequently asked questions by our customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {faqData.slice(0, 6).map((faq) => (
                        <button
                          key={faq.id}
                          onClick={() => toggleExpanded(faq.id)}
                          className="text-left p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {faq.question}
                          </h4>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
