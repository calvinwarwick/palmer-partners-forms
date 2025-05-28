
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, FileText, Phone, Mail, Award, Shield, Clock, Star, Bed, Bath, Square, Eye, Heart } from "lucide-react";
import OptimizedCard from "@/components/optimized/OptimizedCard";

// Enhanced mock property data for both sales and lettings
const mockProperties = [
  {
    id: 1,
    address: "Lexden Road, Colchester, Essex",
    price: "£695,000",
    priceType: "sale",
    type: "Detached",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2150,
    status: "For Sale",
    featured: true,
    image: "/lovable-uploads/2ffe88f6-5299-4edd-b1b2-e44585fafe59.png",
    description: "Modern family home with stunning contemporary design, spacious garden and premium finishes throughout.",
    features: ["Garden", "Parking", "Modern Kitchen", "En-Suite", "Double Glazing"]
  },
  {
    id: 2,
    address: "Victoria Gardens, Kensington, London SW7",
    price: "£3,500",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    status: "To Let",
    featured: true,
    image: "/placeholder.svg",
    description: "Luxury apartment in prestigious Kensington with period features and modern amenities.",
    features: ["Balcony", "Concierge", "Furnished", "Central Heating", "Gym Access"]
  },
  {
    id: 3,
    address: "Heritage Mews, Chelsea, London SW3",
    price: "£1,250,000",
    priceType: "sale",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    status: "For Sale",
    featured: false,
    image: "/placeholder.svg",
    description: "Charming Victorian mews house with private courtyard in the heart of Chelsea.",
    features: ["Private Garden", "Period Features", "Fireplace", "Wine Cellar", "Parking"]
  },
  {
    id: 4,
    address: "Riverside View, Notting Hill, London W11",
    price: "£2,800",
    priceType: "pcm",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    status: "Let Agreed",
    featured: false,
    image: "/placeholder.svg",
    description: "Contemporary riverside apartment with stunning views and excellent transport links.",
    features: ["River View", "Balcony", "Gym Access", "Concierge", "Storage"]
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [priceFilter, setPriceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [saleTypeFilter, setSaleTypeFilter] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProperties(term, priceFilter, typeFilter, saleTypeFilter);
  };

  const filterProperties = (search: string, price: string, type: string, saleType: string) => {
    let filtered = mockProperties;

    if (search) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(search.toLowerCase()) ||
        property.type.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (saleType && saleType !== "all") {
      filtered = filtered.filter(property => property.priceType === saleType);
    }

    if (type && type !== "all") {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Palmer & Partners</h1>
                <p className="text-gray-600 font-medium">Premium Estate Agents</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-blue-600 font-semibold">Properties</Link>
              <a href="#sales" className="text-gray-700 hover:text-blue-600 transition-colors">Sales</a>
              <a href="#lettings" className="text-gray-700 hover:text-blue-600 transition-colors">Lettings</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Login</Button>
              </Link>
              <Link to="/application">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f1f5f9\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Find Your Perfect
              <br />
              <span className="text-blue-600">Home</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Whether you're looking to buy, sell, rent, or let, we connect you with London's finest properties
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter location or postcode..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 py-4 text-gray-900 border-gray-200 focus:border-blue-500 rounded-xl h-14"
                  />
                </div>
                <select 
                  className="px-4 py-4 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 h-14"
                  value={saleTypeFilter}
                  onChange={(e) => {
                    setSaleTypeFilter(e.target.value);
                    filterProperties(searchTerm, priceFilter, typeFilter, e.target.value);
                  }}
                >
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="pcm">To Rent</option>
                </select>
                <select 
                  className="px-4 py-4 border border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 h-14"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    filterProperties(searchTerm, priceFilter, e.target.value, saleTypeFilter);
                  }}
                >
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="detached">Detached</option>
                </select>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg font-semibold rounded-xl">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales & Lettings Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-2xl">
              <div className="flex space-x-2">
                <Button 
                  variant={saleTypeFilter === "sale" || saleTypeFilter === "" ? "default" : "ghost"}
                  className="rounded-xl px-8 py-3"
                  onClick={() => {
                    setSaleTypeFilter("sale");
                    filterProperties(searchTerm, priceFilter, typeFilter, "sale");
                  }}
                >
                  For Sale
                </Button>
                <Button 
                  variant={saleTypeFilter === "pcm" ? "default" : "ghost"}
                  className="rounded-xl px-8 py-3"
                  onClick={() => {
                    setSaleTypeFilter("pcm");
                    filterProperties(searchTerm, priceFilter, typeFilter, "pcm");
                  }}
                >
                  To Rent
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+</div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1,200+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">15+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">98%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
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
              Discover exceptional properties for sale and rent across London's most desirable locations
            </p>
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-6 py-2 bg-blue-50 text-blue-700 border-blue-200">
                {filteredProperties.length} properties available
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <OptimizedCard
                key={property.id}
                id={property.id}
                address={property.address}
                price={property.price}
                priceType={property.priceType}
                type={property.type}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                sqft={property.sqft}
                status={property.status}
                image={property.image}
                description={property.description}
                features={property.features}
                featured={property.featured}
              />
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
                Leading London's property market with expertise in both sales and lettings across the capital's most prestigious areas
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  <Award className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Premium Portfolio</h4>
                <p className="text-gray-600 leading-relaxed">Exclusive access to London's finest properties for sale and rent in prime locations including Kensington, Chelsea, and Mayfair</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  <Shield className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Expert Guidance</h4>
                <p className="text-gray-600 leading-relaxed">Professional agents with deep local market knowledge providing expert advice for buyers, sellers, landlords, and tenants</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  <Clock className="h-8 w-8 text-white mx-auto mt-2" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">Seamless Service</h4>
                <p className="text-gray-600 leading-relaxed">End-to-end support from initial consultation to completion, with dedicated specialists for sales and lettings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make Your Move?</h3>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Whether buying, selling, renting, or letting - start your property journey with London's trusted experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/application">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                  Get Started Today
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl">
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
              <p className="text-xl text-gray-600">Our expert sales and lettings teams are here to help</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow border border-gray-100">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Sales Enquiries</h4>
                  <p className="text-gray-600 text-lg">+44 20 7123 4567</p>
                  <p className="text-gray-500 text-sm mt-2">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow border border-gray-100">
                  <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Lettings Team</h4>
                  <p className="text-gray-600 text-lg">+44 20 7123 4568</p>
                  <p className="text-gray-500 text-sm mt-2">Mon-Sat 8AM-7PM</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow border border-gray-100">
                  <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-xl mb-3 text-gray-900">Email Us</h4>
                  <p className="text-gray-600 text-lg">info@palmerpartners.com</p>
                  <p className="text-gray-500 text-sm mt-2">24/7 Support</p>
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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Palmer & Partners</span>
                  <p className="text-blue-400 font-medium">Premium Estate Agents</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                London's premier estate agency specializing in luxury sales and lettings across the capital's most prestigious neighborhoods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#sales" className="hover:text-blue-400 transition-colors">Property Sales</a></li>
                <li><a href="#lettings" className="hover:text-blue-400 transition-colors">Lettings & Rentals</a></li>
                <li><Link to="/application" className="hover:text-blue-400 transition-colors">Property Management</Link></li>
                <li><a href="#about" className="hover:text-blue-400 transition-colors">Valuations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> info@palmerpartners.com</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +44 20 7123 4567</p>
                <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Kensington High St, London</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Palmer & Partners. All rights reserved. | Licensed Estate Agents | ARLA & NAEA Members</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
