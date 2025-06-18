
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const FormSection = ({
  title,
  subtitle,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
}: FormSectionProps) => {
  return (
    <Card
      className={cn(
        "border-2 border-gray-200 bg-gradient-to-br from-white to-orange-50/30",
        "shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {(title || icon) && (
        <CardHeader
          className={cn(
            "pb-3 md:pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg",
            headerClassName
          )}
        >
          <CardTitle className="text-base md:text-lg font-semibold flex items-center">
            <div className="flex items-center gap-2 md:gap-3">
              {icon && (
                <div className="p-1.5 md:p-2 bg-white/20 rounded-lg">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <span className="text-white text-sm md:text-base">{title}</span>
                )}
                {subtitle && (
                  <p className="text-orange-100 text-xs md:text-sm font-normal mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent
        className={cn(
          "space-y-4 md:space-y-6 p-4 md:p-6",
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
};
