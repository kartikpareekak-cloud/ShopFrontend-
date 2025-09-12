import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Panditji Auto Connect</title>
        <meta
          name="description"
          content="Terms of Service for Panditji Auto Connect. Read our terms and conditions for purchasing auto parts, warranty policies, and user responsibilities."
        />
        <meta name="keywords" content="terms of service, terms and conditions, warranty, return policy, Panditji Auto Connect" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: August 29, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              These Terms of Service ("Terms") govern your use of the Panditji Auto Connect website 
              and services. By accessing or using our website, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, you may not access our service.
            </p>
          </CardContent>
        </Card>

        {/* Use of Service */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Use of Our Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligibility</h3>
              <p className="text-gray-600">
                You must be at least 18 years old to use our services. By using our website, 
                you represent and warrant that you meet this age requirement.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Responsibility</h3>
              <p className="text-gray-600 mb-2">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Keeping your account information up to date</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prohibited Uses</h3>
              <p className="text-gray-600 mb-2">You may not use our service:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations or laws</li>
                <li>To transmit malicious code, viruses, or harmful materials</li>
                <li>To attempt to gain unauthorized access to our systems</li>
                <li>To harass, abuse, insult, harm, defame, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Products and Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              Products and Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
              <p className="text-gray-600">
                We strive to provide accurate product descriptions, images, and pricing. However, 
                we do not warrant that product descriptions or other content is accurate, complete, 
                or error-free. Colors and images are for illustration purposes only.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing and Availability</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>All prices are subject to change without notice</li>
                <li>Prices are listed in Indian Rupees (INR) and include applicable taxes</li>
                <li>Product availability is subject to stock levels</li>
                <li>We reserve the right to limit quantities or discontinue products</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Acceptance</h3>
              <p className="text-gray-600">
                Your order is an offer to buy products from us. All orders are subject to our 
                acceptance. We may refuse or cancel any order for any reason, including product 
                availability, errors in pricing, or suspected fraudulent activity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">
              We accept various payment methods including online payments through Razorpay and Cash on Delivery (COD).
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Payment must be completed before order processing</li>
              <li>COD charges may apply for orders below ₹999</li>
              <li>Online payments are processed securely through our payment partners</li>
              <li>Refunds will be processed within 7-10 business days</li>
              <li>You are responsible for any bank charges or transaction fees</li>
            </ul>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              Shipping and Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Timeline</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Standard delivery: 3-7 business days</li>
                <li>Express delivery: 1-3 business days (additional charges apply)</li>
                <li>Delivery times may vary based on location and product availability</li>
                <li>Orders are processed Monday to Saturday (excluding holidays)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Charges</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Free shipping on orders above ₹999</li>
                <li>Standard shipping charges apply for orders below ₹999</li>
                <li>Express delivery charges calculated at checkout</li>
                <li>Additional charges for remote locations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk of Loss</h3>
              <p className="text-gray-600">
                Risk of loss and title for products purchased from us pass to you upon delivery 
                to the carrier. We are not responsible for products lost or damaged during shipping.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-blue-600" />
              Returns and Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Policy</h3>
              <p className="text-gray-600 mb-2">
                We accept returns within 7 days of delivery for eligible products:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Products must be unused and in original packaging</li>
                <li>Return shipping costs may apply</li>
                <li>Some products may not be eligible for return (electrical items, custom parts)</li>
                <li>Returns must be authorized before shipping back to us</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Process</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Refunds processed within 7-10 business days after return receipt</li>
                <li>Refunds issued to original payment method</li>
                <li>Shipping charges are non-refundable unless item is defective</li>
                <li>Partial refunds may apply for returned items not in original condition</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Warranty */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Warranty and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">
              We provide manufacturer warranties on applicable products. Warranty terms vary by 
              product and manufacturer. We disclaim all other warranties, express or implied.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Warranty claims must be made within the specified warranty period</li>
              <li>Proof of purchase required for warranty claims</li>
              <li>Misuse or unauthorized modifications void warranty</li>
              <li>We are not liable for consequential or incidental damages</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              In no event shall Panditji Auto Connect be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including without limitation, loss of 
              profits, data, use, goodwill, or other intangible losses.
            </p>
            <p className="text-gray-600">
              Our total liability to you for all damages shall not exceed the amount you paid 
              for the specific product or service that gave rise to the claim.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason, including breach of these Terms. Upon termination, your right to use 
              the service ceases immediately.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
              of the courts in Noida, Uttar Pradesh, India.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We reserve the right to modify or replace these Terms at any time. If a revision is 
              material, we will try to provide at least 30 days' notice prior to any new terms 
              taking effect. Continued use of our service after changes become effective constitutes 
              acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> legal@panditjiautoconnect.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> 123 Auto Parts Street, Sector 15, Noida, UP - 201301, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TermsOfService;
