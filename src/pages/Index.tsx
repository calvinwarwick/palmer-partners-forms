
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Users, FileText } from "lucide-react";

// Mock property data (will be replaced with API integration later)
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
    description: "Modern 2-bedroom apartment in prime location with excellent transport links."
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
    description: "Spacious 3-bedroom family home with garden and parking."
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
    description: "Cozy 1-bedroom apartment perfect for professionals."
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredProperties(mockProperties);
    } else {
      const filtered = mockProperties.filter(property =>
        property.address.toLowerCase().includes(term.toLowerCase()) ||
        property.type.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
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
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Properties</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="outline">Login</Button>
              <Button>Apply Now</Button>
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by location or property type..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900"
              />
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
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Application
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">EstateAgent</span>
              </div>
              <p className="text-gray-600">
                Professional estate agency services with a modern approach to property rental and sales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Properties</a></li>
                <li><a href="#" className="hover:text-blue-600">Apply</a></li>
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-600">
                <p>📧 info@estateagent.com</p>
                <p>📞 +44 20 1234 5678</p>
                <p>📍 123 Business Street, London</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 EstateAgent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
