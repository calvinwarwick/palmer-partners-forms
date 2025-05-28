
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Eye, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OptimizedCardProps {
  id: number;
  address: string;
  price: string;
  priceType: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  status: string;
  image: string;
  description: string;
  features: string[];
  featured?: boolean;
  children?: React.ReactNode;
}

const OptimizedCard = memo(({
  id,
  address,
  price,
  priceType,
  type,
  bedrooms,
  bathrooms,
  sqft,
  status,
  image,
  description,
  features,
  featured = false,
  children
}: OptimizedCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "For Sale":
        return "bg-emerald-500";
      case "To Let":
        return "bg-blue-500";
      case "Let Agreed":
        return "bg-orange-500";
      case "Sold":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="group overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={address}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Featured badge */}
        {featured && (
          <Badge className="absolute top-4 left-4 bg-orange-500 text-white font-semibold px-3 py-1 rounded-full">
            Featured
          </Badge>
        )}
        
        {/* Status badge */}
        <Badge 
          className={`absolute top-4 right-4 text-white font-semibold px-3 py-1 rounded-full ${getStatusColor(status)}`}
        >
          {status}
        </Badge>

        {/* Action buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white">
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="font-bold text-2xl text-gray-900">
              {price}
              {priceType === "pcm" && <span className="text-sm font-normal text-gray-600 ml-1">pcm</span>}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="border-blue-200 text-blue-700 font-medium">
            {type}
          </Badge>
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
        </div>

        <h4 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
          {type} in {address.split(',')[1] || address.split(',')[0]}
        </h4>
        
        <p className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </p>

        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">{description}</p>

        {/* Property details */}
        <div className="flex items-center justify-between text-gray-600 mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm font-medium">
              <Bed className="h-4 w-4 mr-1 text-blue-600" />
              {bedrooms}
            </span>
            <span className="flex items-center text-sm font-medium">
              <Bath className="h-4 w-4 mr-1 text-blue-600" />
              {bathrooms}
            </span>
            {sqft && (
              <span className="flex items-center text-sm font-medium">
                <Square className="h-4 w-4 mr-1 text-blue-600" />
                {sqft} sqft
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl">
            View Details
          </Button>
          <Link to="/application" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
              {priceType === "sale" ? "Enquire" : "Apply"}
            </Button>
          </Link>
        </div>

        {children}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;
