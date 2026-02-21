#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Blog Posts Downloader
Downloads all blog posts from Supabase to local JSON/Markdown files
Usage: python scripts/download_blog_posts.py
"""
import os
import json
import urllib.request
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')
URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

def fetch_blog_posts():
    """Fetch all blog posts from Supabase"""
    req = urllib.request.Request(
        f'{URL}/rest/v1/blog_posts?select=*&order=published_at.desc',
        headers={'apikey': KEY, 'Authorization': f'Bearer {KEY}'}
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def save_as_json(posts, output_dir):
    """Save all posts as a single JSON file"""
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, 'blog_posts.json')
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2, default=str)
    print(f'Saved: {filepath} ({len(posts)} posts)')
    return filepath

def save_as_markdown(posts, output_dir):
    """Save each post as individual Markdown file"""
    md_dir = os.path.join(output_dir, 'markdown')
    os.makedirs(md_dir, exist_ok=True)
    
    for post in posts:
        slug = post.get('slug', 'untitled')
        title = post.get('title', 'Untitled')
        description = post.get('description', '')
        content = post.get('content', '')
        category = post.get('category', '')
        published_at = post.get('published_at', '')
        is_published = post.get('is_published', False)
        
        frontmatter = f"""---
title: "{title}"
slug: "{slug}"
description: "{description}"
category: "{category}"
published_at: "{published_at}"
is_published: {str(is_published).lower()}
---

"""
        filepath = os.path.join(md_dir, f'{slug}.md')
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(frontmatter + (content or ''))
        print(f'{os.path.abspath(filepath)}')
    
    print(f'Saved {len(posts)} markdown files to {md_dir}')

def save_summary_csv(posts, output_dir):
    """Save posts summary as CSV"""
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, 'blog_posts_summary.csv')
    
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        # Header
        f.write('slug,title,category,is_published,is_premium,required_plan,published_at\n')
        # Data rows
        for post in posts:
            row = [
                post.get('slug', ''),
                post.get('title', '').replace(',', ' '),
                post.get('category', ''),
                str(post.get('is_published', False)),
                str(post.get('is_premium', False)),
                post.get('required_plan', ''),
                post.get('published_at', '')
            ]
            f.write(','.join(row) + '\n')
    
    print(f'Saved: {filepath}')

def main():
    print('=' * 50)
    print('Blog Posts Downloader')
    print('=' * 50)
    
    # Create output directory with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_dir = f'downloads/blog_backup_{timestamp}'
    
    print(f'\nFetching blog posts from Supabase...')
    posts = fetch_blog_posts()
    print(f'Found {len(posts)} posts')
    
    if not posts:
        print('No posts to download.')
        return
    
    print(f'\nSaving to: {output_dir}')
    
    # Save in different formats
    save_as_json(posts, output_dir)
    save_summary_csv(posts, output_dir)
    
    print('\n▼Saving individual markdown files:==================')
    save_as_markdown(posts, output_dir)
    
    print('\n')
    print('Download complete!')
    print(f'Output directory: {output_dir}')

if __name__ == '__main__':
    main()
