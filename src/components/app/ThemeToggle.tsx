import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Readonly<ThemeToggleProps>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Appearance</Label>
      <div className="flex gap-2">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => theme === 'dark' && onToggle()}
          className="flex-1"
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => theme === 'light' && onToggle()}
          className="flex-1"
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>
      </div>
    </div>
  );
}
