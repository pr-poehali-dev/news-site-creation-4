import { useState, useEffect } from 'react';
import NewsHeader from '../components/NewsHeader';
import NewsCard from '../components/NewsCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://functions.poehali.dev/f6dff293-0616-4467-8e83-100d280718ec';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  video_url?: string;
  published_at: string;
  source_url?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'только что';
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} ${diffDays < 5 ? 'дня' : 'дней'} назад`;
  
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('Главная');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchNews = async (category?: string) => {
    setLoading(true);
    try {
      const url = category && category !== 'Главная' 
        ? `${API_URL}?category=${encodeURIComponent(category)}&limit=20`
        : `${API_URL}?limit=20`;
      
      const response = await fetch(url);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить новости',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async () => {
    setUpdating(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      
      toast({
        title: 'Новости обновлены!',
        description: result.message,
      });
      
      await fetchNews(activeCategory);
    } catch (error) {
      toast({
        title: 'Ошибка обновления',
        description: 'Не удалось обновить новости',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeader 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">
              {activeCategory === 'Главная' ? 'Главные новости' : activeCategory}
            </h2>
            <p className="text-muted-foreground">
              Уникальные новости с автоматическим рерайтом
            </p>
          </div>
          <Button
            onClick={updateNews}
            disabled={updating}
            className="gap-2"
            size="lg"
          >
            <Icon name={updating ? 'Loader2' : 'RefreshCw'} size={18} className={updating ? 'animate-spin' : ''} />
            {updating ? 'Обновляем...' : 'Обновить новости'}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Newspaper" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Новостей пока нет</h3>
            <p className="text-muted-foreground mb-6">Нажмите «Обновить новости» чтобы загрузить свежие статьи</p>
            <Button onClick={updateNews} disabled={updating}>
              Загрузить новости
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {news.map((item, index) => (
              <NewsCard
                key={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                imageUrl={item.image_url}
                videoUrl={item.video_url}
                date={formatDate(item.published_at)}
                isMain={index === 0}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 НовостиПро. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;