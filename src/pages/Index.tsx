import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Car, Home, Search, Filter, Star, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  
  const mockProperties = [
    {
      id: 1,
      title: "Modern 2-Bed Apartment",
      address: "123 Oak Street, London, SW1A 1AA",
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      type: "Apartment",
      rating: 4.8,
      image: "/placeholder.svg",
      description: "Beautiful modern apartment in the heart of London with excellent transport links."
    },
    {
      id: 2,
      title: "Victorian Terrace House",
      address: "456 Pine Avenue, Manchester, M1 4BD",
      price: 1800,
      bedrooms: 3,
      bathrooms: 2,
      parking: 0,
      type: "House",
      rating: 4.6,
      image: "/placeholder.svg",
      description: "Charming Victorian terrace with original features and modern amenities."
    },
    {
      id: 3,
      title: "Contemporary Studio",
      address: "789 Elm Close, Birmingham, B2 4QA",
      price: 1200,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      type: "Studio",
      rating: 4.4,
      image: "/placeholder.svg",
      description: "Perfect studio for young professionals in Birmingham city center."
    }
  ];

  const navigate = useNavigate();

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "1000-1500" && property.price >= 1000 && property.price <= 1500) ||
                        (priceRange === "1500-2000" && property.price >= 1500 && property.price <= 2000) ||
                        (priceRange === "2000+" && property.price >= 2000);
    
    const matchesType = propertyType === "all" || property.type.toLowerCase() === propertyType.toLowerCase();
    
    const matchesBedrooms = bedrooms === "all" || property.bedrooms.toString() === bedrooms;
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">EstateAgent</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/application" className="text-gray-600 hover:text-blue-600 transition-colors">
                Apply for Tenancy
              </Link>
              {user ? (
                <Link to="/login">
                  <Button variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Find Your Perfect Rental Property</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing rental properties with our comprehensive estate agent platform. 
            From modern apartments to family homes, find your next home today.
          </p>
          <Button size="lg" variant="secondary" onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}>
            Browse Properties
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by property or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="1000-1500">£1,000 - £1,500</SelectItem>
                <SelectItem value="1500-2000">£1,500 - £2,000</SelectItem>
                <SelectItem value="2000+">£2,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of rental properties across the UK. 
              Each property is verified and ready for immediate viewing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    {property.parking > 0 && (
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        <span>{property.parking}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">£{property.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <Button 
                      onClick={() => navigate('/application')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties found matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your New Home?</h3>
          <p className="text-xl mb-8">Join thousands of satisfied tenants who found their perfect rental through our platform.</p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/application')}
            >
              Start Your Application
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/login')}
              >
                Agent Login
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6" />
                <span className="text-xl font-bold">EstateAgent</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect rental property across the UK.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Apartments</a></li>
                <li><a href="#" className="hover:text-white">Houses</a></li>
                <li><a href="#" className="hover:text-white">Studios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Property Management</a></li>
                <li><a href="#" className="hover:text-white">Tenant Screening</a></li>
                <li><a href="#" className="hover:text-white">Maintenance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Phone: +44 20 1234 5678</li>
                <li>Email: info@estateagent.com</li>
                <li>Address: 123 Business Street, London</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EstateAgent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
