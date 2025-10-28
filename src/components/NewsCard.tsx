import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  date: string;
  isMain?: boolean;
}

const categoryColors: Record<string, string> = {
  'Политика': 'bg-[hsl(var(--news-politics))] text-white',
  'Экономика': 'bg-[hsl(var(--news-economy))] text-white',
  'Спорт': 'bg-green-600 text-white',
  'Технологии': 'bg-[hsl(var(--news-tech))] text-white',
  'Культура': 'bg-pink-600 text-white',
};

export default function NewsCard({
  title,
  description,
  category,
  imageUrl,
  videoUrl,
  date,
  isMain = false,
}: NewsCardProps) {
  return (
    <Card
      className={`group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isMain ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`}
    >
      <div className="relative overflow-hidden">
        {videoUrl ? (
          <div className="relative aspect-video bg-muted">
            <video
              src={videoUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Icon name="Play" size={32} className="text-primary ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className={`${isMain ? 'aspect-[16/10]' : 'aspect-video'} bg-muted overflow-hidden`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Icon name="Newspaper" size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
        )}
        <Badge className={`absolute top-4 left-4 ${categoryColors[category] || 'bg-primary'}`}>
          {category}
        </Badge>
      </div>

      <div className={`p-${isMain ? '6' : '4'}`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Icon name="Clock" size={14} />
          <span>{date}</span>
        </div>
        <h3 className={`font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors ${
          isMain ? 'text-2xl md:text-3xl' : 'text-lg'
        }`}>
          {title}
        </h3>
        <p className={`text-muted-foreground line-clamp-${isMain ? '3' : '2'}`}>
          {description}
        </p>
      </div>
    </Card>
  );
}
