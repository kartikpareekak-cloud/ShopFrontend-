import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Users, Lock, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Panditji Auto Connect</title>
        <meta
          name="description"
          content="Privacy Policy for Panditji Auto Connect. Learn how we collect, use, and protect your personal information when you shop for auto parts with us."
        />
        <meta name="keywords" content="privacy policy, data protection, personal information, Panditji Auto Connect" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: August 29, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Your Privacy Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              At Panditji Auto Connect, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you visit our website or make a purchase from us.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600 mb-2">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Create an account on our website</li>
                <li>Make a purchase or place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Information Collected Automatically</h3>
              <p className="text-gray-600 mb-2">
                When you visit our website, we may automatically collect certain information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring website addresses</li>
                <li>Search terms used on our site</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To process and fulfill your orders</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To send order confirmations and shipping updates</li>
              <li>To improve our website and user experience</li>
              <li>To send promotional emails (with your consent)</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
              <li>To analyze website usage and trends</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except in the following circumstances:
            </p>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Providers</h3>
              <p className="text-gray-600">
                We may share information with trusted third-party service providers who assist us in 
                operating our website, conducting business, or serving you, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Payment processors (Razorpay)</li>
                <li>Shipping companies</li>
                <li>Email service providers</li>
                <li>Web hosting services</li>
                <li>Analytics providers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
              <p className="text-gray-600">
                We may disclose your information when required by law or to protect our rights, 
                property, or safety, or that of others.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Data backup and recovery procedures</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              We use cookies and similar tracking technologies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Show relevant advertisements (with consent)</li>
            </ul>
            <p className="text-gray-600 mt-3">
              You can control cookies through your browser settings, but disabling cookies may affect website functionality.
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> privacy@panditjiautoconnect.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> 123 Auto Parts Street, Sector 15, Noida, UP - 201301, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PrivacyPolicy;
