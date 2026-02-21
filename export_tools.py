import os, json, urllib.request
from dotenv import load_dotenv
load_dotenv('.env.local')
URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

req = urllib.request.Request(
    f'{URL}/rest/v1/tools?select=tool_id,name,description,category&order=tool_id',
    headers={'apikey': KEY, 'Authorization': f'Bearer {KEY}'}
)
with urllib.request.urlopen(req) as res:
    tools = json.loads(res.read())
    print("通番\tツール名\t説明文\t使用ツール\tカテゴリー")
    for t in tools:
        tid = t['tool_id']
        name = t['name'] or ''
        desc = t['description'] or ''
        cat = t['category'] or ''
        tool_type = 'ChatGPT / Claude / Gemini'
        print(f"{tid}\t{name}\t{desc}\t{tool_type}\t{cat}")
