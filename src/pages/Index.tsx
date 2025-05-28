
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Users, FileText, Phone, Mail, Building, Award, Shield, Clock, Star } from "lucide-react";

// Mock property data
const mockProperties = [
  {
    id: 1,
    address: "123 Oak Street, Kensington, London SW7",
    price: "£3,500",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    status: "Available",
    image: "/placeholder.svg",
    description: "Elegant 2-bedroom apartment in prestigious Kensington with period features and modern amenities.",
    features: ["Balcony", "Parking", "Furnished", "Central Heating", "Concierge"]
  },
  {
    id: 2,
    address: "456 Pine Avenue, Chelsea, London SW3",
    price: "£2,800",
    priceType: "pcm",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    status: "Available",
    image: "/placeholder.svg",
    description: "Charming Victorian terrace house with private garden in the heart of Chelsea.",
    features: ["Garden", "Period Features", "Fireplace", "Double Glazing", "Parking"]
  },
  {
    id: 3,
    address: "789 Elm Close, Notting Hill, London W11",
    price: "£2,200",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    status: "Let Agreed",
    image: "/placeholder.svg",
    description: "Contemporary 1-bedroom apartment in vibrant Notting Hill with excellent transport links.",
    features: ["Balcony", "Gym Access", "Concierge", "Storage", "Modern Kitchen"]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Palmer & Partners</h1>
                <p className="text-blue-600 font-medium">Premium Estate Agents</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Properties</Link>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Login</Button>
              </Link>
              <Link to="/application">
                <Button className="bg-blue-600 hover:bg-blue-700">Apply Now</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover London's Finest Properties
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Your trusted partner in finding exceptional homes across London's most prestigious neighborhoods
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <Input
                    type="text"
                    placeholder="Search by location, type, or keyword..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-14 py-4 text-gray-900 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                <select 
                  className="px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-blue-500"
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
                  className="px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-blue-500"
                  value={priceFilter}
                  onChange={(e) => {
                    setPriceFilter(e.target.value);
                    filterProperties(searchTerm, e.target.value, typeFilter);
                  }}
                >
                  <option value="">Max Price</option>
                  <option value="2000">Up to £2,000</option>
                  <option value="2500">Up to £2,500</option>
                  <option value="3000">Up to £3,000</option>
                  <option value="4000">Up to £4,000</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">1,200+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">15+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium properties in London's most desirable locations
            </p>
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredProperties.length} properties available
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-56 object-cover"
                  />
                  <Badge 
                    className={`absolute top-4 right-4 text-white font-semibold ${getStatusColor(property.status)}`}
                  >
                    {property.status}
                  </Badge>
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="font-bold text-blue-600">{property.price} {property.priceType}</span>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-blue-200 text-blue-700">{property.type}</Badge>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <CardDescription className="flex items-center text-gray-700 text-base">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    {property.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{property.description}</p>
                  <div className="flex items-center space-x-6 text-gray-600 mb-6">
                    <span className="flex items-center font-medium">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      {property.bedrooms} bed
                    </span>
                    <span className="flex items-center font-medium">
                      <Building className="h-5 w-5 mr-2 text-blue-600" />
                      {property.bathrooms} bath
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-sm bg-blue-50 text-blue-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                      View Details
                    </Button>
                    <Link to="/application" className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Palmer & Partners?</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                With over 15 years of experience in London's premium property market, we deliver exceptional service and unmatched expertise
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-blue-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:bg-blue-700 transition-colors">
                  <Award className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Premium Portfolio</h4>
                <p className="text-gray-600 leading-relaxed">Exclusive access to London's most prestigious properties in prime locations including Kensington, Chelsea, and Mayfair</p>
              </div>
              <div className="text-center group">
                <div className="bg-blue-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:bg-blue-700 transition-colors">
                  <Shield className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Trusted Service</h4>
                <p className="text-gray-600 leading-relaxed">Professional agents with deep local market knowledge and a commitment to protecting your interests throughout the process</p>
              </div>
              <div className="text-center group">
                <div className="bg-blue-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:bg-blue-700 transition-colors">
                  <Clock className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Quick Process</h4>
                <p className="text-gray-600 leading-relaxed">Streamlined application and rental process with 24/7 support to ensure you find your perfect home quickly and efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h3>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Start your journey with Palmer & Partners today and experience London living at its finest
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/application">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Start Application
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <p className="text-xl text-gray-600">Our expert team is here to help you every step of the way</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Phone</h4>
                  <p className="text-gray-600 text-lg">+44 20 7123 4567</p>
                  <p className="text-gray-500 text-sm mt-2">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Email</h4>
                  <p className="text-gray-600 text-lg">info@palmerpartners.com</p>
                  <p className="text-gray-500 text-sm mt-2">24/7 Support</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Office</h4>
                  <p className="text-gray-600 text-lg">123 Kensington High St</p>
                  <p className="text-gray-500 text-sm mt-2">London W8 5SF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Palmer & Partners</span>
                  <p className="text-blue-400 font-medium">Premium Estate Agents</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                London's premier estate agency specializing in luxury residential properties across the capital's most prestigious neighborhoods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Properties</Link></li>
                <li><Link to="/application" className="hover:text-blue-400 transition-colors">Apply</Link></li>
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> info@palmerpartners.com</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +44 20 7123 4567</p>
                <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Kensington High St, London</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Palmer & Partners. All rights reserved. | Licensed Estate Agents</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
