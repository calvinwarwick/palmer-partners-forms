
import { memo } from 'react';
import { Button } from '@/components/ui/button';

interface OptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  disabled?: boolean;
}

const OptimizedButton = memo(({
  children,
  onClick,
  variant,
  className,
  disabled
}: OptimizedButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={className}
      disabled={disabled}
    >
      {children}
    </Button>
  );
});

OptimizedButton.displayName = 'OptimizedButton';

export default OptimizedButton;
