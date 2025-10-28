"""
Business: Fetch RSS feeds, rewrite news using OpenAI, save to database
Args: event - dict with httpMethod ('GET' to fetch, 'POST' to trigger update)
      context - object with request_id, function_name attributes
Returns: HTTP response with fetched/updated news
"""

import json
import os
import feedparser
from datetime import datetime
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from openai import OpenAI

RSS_FEEDS = {
    'Политика': 'https://tass.ru/rss/v2.xml',
    'Экономика': 'https://www.interfax.ru/rss.asp',
    'Спорт': 'https://rsport.ria.ru/export/rss2/sport/index.xml',
    'Технологии': 'https://www.vedomosti.ru/rss/rubric/technology',
    'Культура': 'https://ria.ru/export/rss2/culture/index.xml',
}

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def rewrite_with_openai(title: str, description: str) -> Dict[str, str]:
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError('OPENAI_API_KEY not found in environment')
    
    client = OpenAI(api_key=api_key)
    
    prompt = f"""Перепиши эту новость уникально, сохранив смысл и факты. Сделай SEO-оптимизированный заголовок и описание.

Оригинал:
Заголовок: {title}
Описание: {description}

Верни JSON:
{{"title": "новый заголовок", "description": "новое описание (2-3 предложения)"}}"""
    
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': prompt}],
        response_format={'type': 'json_object'}
    )
    
    return json.loads(response.choices[0].message.content)

def fetch_and_save_news(category: str, feed_url: str, limit: int = 5) -> int:
    feed = feedparser.parse(feed_url)
    conn = get_db_connection()
    cursor = conn.cursor()
    saved_count = 0
    
    for entry in feed.entries[:limit]:
        original_title = entry.get('title', '')
        original_description = entry.get('summary', entry.get('description', ''))
        source_url = entry.get('link', '')
        
        if not original_title or not original_description:
            continue
        
        cursor.execute(
            "SELECT id FROM news WHERE source_url = %s",
            (source_url,)
        )
        if cursor.fetchone():
            continue
        
        try:
            rewritten = rewrite_with_openai(original_title, original_description)
            
            cursor.execute("""
                INSERT INTO news (title, description, category, source_url, original_title, is_published)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                rewritten['title'],
                rewritten['description'],
                category,
                source_url,
                original_title,
                True
            ))
            conn.commit()
            saved_count += 1
        except Exception as e:
            conn.rollback()
            print(f"Error rewriting news: {e}")
            continue
    
    cursor.close()
    conn.close()
    return saved_count

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        total_saved = 0
        results = {}
        
        for category, feed_url in RSS_FEEDS.items():
            saved = fetch_and_save_news(category, feed_url, limit=3)
            results[category] = saved
            total_saved += saved
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'message': f'Добавлено {total_saved} новостей',
                'results': results
            }, ensure_ascii=False)
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query_params = event.get('queryStringParameters') or {}
    category = query_params.get('category')
    limit = int(query_params.get('limit', 20))
    
    if category and category != 'Главная':
        cursor.execute("""
            SELECT id, title, description, category, image_url, video_url, 
                   published_at, source_url
            FROM news 
            WHERE category = %s AND is_published = true
            ORDER BY published_at DESC
            LIMIT %s
        """, (category, limit))
    else:
        cursor.execute("""
            SELECT id, title, description, category, image_url, video_url,
                   published_at, source_url
            FROM news 
            WHERE is_published = true
            ORDER BY published_at DESC
            LIMIT %s
        """, (limit,))
    
    news = cursor.fetchall()
    cursor.close()
    conn.close()
    
    for item in news:
        if item['published_at']:
            item['published_at'] = item['published_at'].isoformat()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(news, ensure_ascii=False, default=str)
    }