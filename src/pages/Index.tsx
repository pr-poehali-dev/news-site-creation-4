import { useState } from 'react';
import NewsHeader from '../components/NewsHeader';
import NewsCard from '../components/NewsCard';

const newsData = [
  {
    id: 1,
    title: 'Новые технологии меняют мир: ИИ достигает невероятных высот',
    description: 'Искусственный интеллект продолжает развиваться семимильными шагами. Эксперты прогнозируют революционные изменения во всех сферах жизни в ближайшие годы.',
    category: 'Технологии',
    date: '2 часа назад',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    isMain: true,
  },
  {
    id: 2,
    title: 'Экономический форум обсудил будущее мировой торговли',
    description: 'На международном экономическом форуме лидеры стран договорились о новых правилах торговли.',
    category: 'Экономика',
    date: '3 часа назад',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Сборная России одержала уверенную победу',
    description: 'Российские спортсмены показали отличную игру и выиграли с крупным счетом.',
    category: 'Спорт',
    date: '4 часа назад',
    videoUrl: '/placeholder-video.mp4',
  },
  {
    id: 4,
    title: 'Премьера долгожданного фильма собрала рекордные сборы',
    description: 'Новый блокбастер побил все рекорды кассовых сборов в первые выходные проката.',
    category: 'Культура',
    date: '5 часов назад',
    imageUrl: 'https://images.unsplash.com/photo-1574267432644-f737b7a0ea8b?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Важные политические переговоры завершились успешно',
    description: 'Стороны достигли консенсуса по ключевым вопросам международного сотрудничества.',
    category: 'Политика',
    date: '6 часов назад',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'Новый стартап привлек $50 млн инвестиций',
    description: 'Молодая технологическая компания получила крупное финансирование для развития.',
    category: 'Экономика',
    date: '7 часов назад',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop',
  },
  {
    id: 7,
    title: 'Олимпийский чемпион установил новый мировой рекорд',
    description: 'Выдающееся достижение атлета войдет в историю мирового спорта.',
    category: 'Спорт',
    date: '8 часов назад',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
  },
  {
    id: 8,
    title: 'Квантовый компьютер решил сложнейшую задачу',
    description: 'Ученые совершили прорыв в области квантовых вычислений.',
    category: 'Технологии',
    date: '9 часов назад',
    videoUrl: '/placeholder-video.mp4',
  },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('Главная');

  const filteredNews = activeCategory === 'Главная' 
    ? newsData 
    : newsData.filter(news => news.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeader 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-2">
            {activeCategory === 'Главная' ? 'Главные новости' : activeCategory}
          </h2>
          <p className="text-muted-foreground">
            Самые актуальные события и происшествия
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              description={news.description}
              category={news.category}
              imageUrl={news.imageUrl}
              videoUrl={news.videoUrl}
              date={news.date}
              isMain={news.isMain}
            />
          ))}
        </div>
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