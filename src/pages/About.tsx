import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Users, Award, Truck, ShieldCheck, Clock } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "50,000+" },
    { icon: Award, label: "Years of Experience", value: "15+" },
    { icon: Truck, label: "Products Delivered", value: "2,00,000+" },
    { icon: ShieldCheck, label: "Quality Guarantee", value: "100%" },
  ];

  const features = [
    "Premium Quality Auto Parts",
    "Genuine OEM & Aftermarket Products",
    "Expert Technical Support",
    "Fast & Reliable Delivery",
    "Competitive Pricing",
    "Easy Returns & Warranty",
  ];

  const teamMembers = [
    {
      name: "Rajesh Pandit",
      role: "Founder & CEO",
      experience: "20+ years in automotive industry",
      description: "Passionate about delivering quality auto parts with excellent customer service.",
    },
    {
      name: "Priya Sharma",
      role: "Operations Manager",
      experience: "12+ years in logistics",
      description: "Ensures timely delivery and maintains our high-quality standards.",
    },
    {
      name: "Amit Kumar",
      role: "Technical Expert",
      experience: "15+ years as automotive engineer",
      description: "Provides technical guidance and product expertise to our customers.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Panditji Auto Connect | Premium Auto Parts Store</title>
        <meta
          name="description"
          content="Learn about Panditji Auto Connect - Your trusted partner for premium auto parts, accessories, and automotive solutions. 15+ years of experience serving customers across India."
        />
        <meta name="keywords" content="about panditji auto connect, auto parts company, automotive experience, quality guarantee" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Panditji Auto Connect</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for premium auto parts, accessories, and automotive solutions. 
            Serving customers across India with quality products and exceptional service since 2009.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2009 by Rajesh Pandit, Panditji Auto Connect began as a small auto parts 
                shop with a vision to provide genuine, high-quality automotive components to vehicle 
                owners across India.
              </p>
              <p>
                What started as a passion project has grown into one of India's most trusted online 
                auto parts retailers. We've built our reputation on three core principles: quality, 
                authenticity, and customer satisfaction.
              </p>
              <p>
                Today, we serve over 50,000 happy customers and have delivered more than 2 lakh 
                products across the country. Our commitment to excellence has made us the go-to 
                destination for auto enthusiasts, mechanics, and everyday vehicle owners.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                To revolutionize the auto parts industry in India by making quality automotive 
                components accessible, affordable, and reliable for every vehicle owner.
              </p>
              <p>
                We believe that every vehicle deserves the best care, which is why we source only 
                genuine OEM and premium aftermarket parts from trusted manufacturers and suppliers.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h3>
            <div className="grid grid-cols-1 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                  <Badge variant="secondary" className="w-fit">
                    <Clock className="h-3 w-3 mr-1" />
                    {member.experience}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product goes through rigorous quality checks 
                before reaching our customers.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Centric</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We continuously strive to 
                exceed their expectations.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We pursue excellence in every aspect of our business - from product selection 
                to customer service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
