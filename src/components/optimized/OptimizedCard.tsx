
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OptimizedCardProps {
  id: number;
  address: string;
  price: string;
  priceType: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  image: string;
  description: string;
  features: string[];
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
  status,
  image,
  description,
  features,
  children
}: OptimizedCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
      {children}
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;
