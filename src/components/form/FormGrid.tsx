
import React from 'react';
import { cn } from '@/lib/utils';

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const FormGrid = ({
  children,
  columns = 2,
  className,
}: FormGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        gridClasses[columns],
        className
      )}
    >
      {children}
    </div>
  );
};
