import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Главная', icon: 'Home' },
  { name: 'Политика', icon: 'Building2' },
  { name: 'Экономика', icon: 'TrendingUp' },
  { name: 'Спорт', icon: 'Trophy' },
  { name: 'Технологии', icon: 'Cpu' },
  { name: 'Культура', icon: 'Palette' },
];

interface NewsHeaderProps {
  onCategoryChange: (category: string) => void;
  activeCategory: string;
}

export default function NewsHeader({ onCategoryChange, activeCategory }: NewsHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              НовостиПро
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? 'default' : 'ghost'}
                onClick={() => onCategoryChange(cat.name)}
                className="gap-2"
              >
                <Icon name={cat.icon as any} size={18} />
                {cat.name}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 animate-fade-in">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? 'default' : 'ghost'}
                onClick={() => {
                  onCategoryChange(cat.name);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Icon name={cat.icon as any} size={18} />
                {cat.name}
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
