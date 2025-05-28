
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Theme selector (disabled)</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme()}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light (Default)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme()}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark (Disabled)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme()}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System (Disabled)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
