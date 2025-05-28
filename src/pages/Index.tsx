
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Users, FileText, Phone, Mail, Building } from "lucide-react";

// Mock property data
const mockProperties = [
  {
    id: 1,
    address: "123 Oak Street, London, SW1A 1AA",
    price: "£2,500",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    status: "Available",
    image: "/placeholder.svg",
    description: "Modern 2-bedroom apartment in prime location with excellent transport links and stunning city views.",
    features: ["Balcony", "Parking", "Furnished", "Central Heating"]
  },
  {
    id: 2,
    address: "456 Pine Avenue, Manchester, M1 1AA",
    price: "£1,800",
    priceType: "pcm",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    status: "Available",
    image: "/placeholder.svg",
    description: "Spacious 3-bedroom family home with garden and parking in quiet residential area.",
    features: ["Garden", "Garage", "Fireplace", "Double Glazing"]
  },
  {
    id: 3,
    address: "789 Elm Close, Birmingham, B1 1AA",
    price: "£1,200",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    status: "Let Agreed",
    image: "/placeholder.svg",
    description: "Cozy 1-bedroom apartment perfect for professionals with modern amenities.",
    features: ["Balcony", "Gym Access", "Concierge", "Storage"]
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [priceFilter, setPriceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProperties(term, priceFilter, typeFilter);
  };

  const filterProperties = (search: string, price: string, type: string) => {
    let filtered = mockProperties;

    if (search) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(search.toLowerCase()) ||
        property.type.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (price) {
      const priceNum = parseInt(price);
      filtered = filtered.filter(property => {
        const propPrice = parseInt(property.price.replace(/[£,]/g, ''));
        return propPrice <= priceNum;
      });
    }

    if (type && type !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredProperties(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "Let Agreed":
        return "bg-orange-500";
      case "Sold":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">EstateAgent</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-blue-600 font-medium">Properties</Link>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/application">
                <Button>Apply Now</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Home
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover quality properties with our expert estate agents
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, type, or keyword..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 text-gray-900"
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    filterProperties(searchTerm, priceFilter, e.target.value);
                  }}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    filterProperties(searchTerm, e.target.value, typeFilter);
                  }}
                >
                  <option value="">Max Price</option>
                  <option value="1500">Up to £1,500</option>
                  <option value="2000">Up to £2,000</option>
                  <option value="2500">Up to £2,500</option>
                  <option value="3000">Up to £3,000</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">Available Properties</h3>
            <p className="text-gray-600">{filteredProperties.length} properties found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 text-white ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-blue-600">
                      {property.price} {property.priceType}
                    </CardTitle>
                    <Badge variant="secondary">{property.type}</Badge>
                  </div>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {property.bedrooms} bed
                    </span>
                    <span>{property.bathrooms} bath</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Link to="/application" className="flex-1">
                      <Button className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose EstateAgent?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Quality Properties</h4>
                <p className="text-gray-600">Carefully selected properties in prime locations</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Expert Service</h4>
                <p className="text-gray-600">Professional agents with local market knowledge</p>
              </div>
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Simple Process</h4>
                <p className="text-gray-600">Streamlined application and rental process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Apply?</h3>
          <p className="text-xl mb-8 opacity-90">
            Start your tenancy application today with our simple online form
          </p>
          <Link to="/application">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Application
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-gray-600">+44 20 1234 5678</p>
              </div>
              <div className="text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-gray-600">info@estateagent.com</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Office</h4>
                <p className="text-gray-600">123 Business Street, London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">EstateAgent</span>
              </div>
              <p className="text-gray-300">
                Professional estate agency services with a modern approach to property rental and sales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-blue-400">Properties</Link></li>
                <li><Link to="/application" className="hover:text-blue-400">Apply</Link></li>
                <li><a href="#about" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 info@estateagent.com</p>
                <p>📞 +44 20 1234 5678</p>
                <p>📍 123 Business Street, London</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EstateAgent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
