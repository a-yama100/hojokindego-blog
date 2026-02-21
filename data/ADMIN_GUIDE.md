# ai-workhack Downloads - Admin Guide

## How to Add New Download Content

### Step 1: Prepare Your Files

1. Create a folder for your project:
   - Location: D:\サイト管理\ai-workhack\ai-workhack-blog\source\
   - Naming: D00001_your_project_name\

2. Required files in the folder:
   - README.txt (English instructions)
   - requirements.txt (Python dependencies)
   - main.py (or your main script)
   - config_example.py (with placeholder values, NOT real API keys)

### Step 2: Create ZIP File
`powershell
Compress-Archive -Path "D:\サイト管理\ai-workhack\ai-workhack-blog\source\D00001_your_project_name\*" -DestinationPath "D:\サイト管理\ai-workhack\ai-workhack-blog\public\downloads\D00001_your_project_name.zip" -Force
`

### Step 3: Update downloads.json

Edit: D:\サイト管理\ai-workhack\ai-workhack-blog\data\downloads.json

Add new entry:
`json
{
  "id": "D00002",
  "title": "Your Tool Name",
  "description": "Brief description of what this tool does.",
  "fileName": "D00002_your_project_name.zip",
  "articleUrl": "/blog/article-slug",
  "category": "AI Tools",
  "tags": ["tag1", "tag2"],
  "version": "1.0.0",
  "status": "published",
  "requirements": ["Python 3.8+", "Ollama"],
  "created_at": "2026-02-03",
  "updated_at": "2026-02-03"
}
`

### Step 4: For Scheduled Articles

If your blog article is not yet published:
1. Set "status": "scheduled"
2. Add "scheduledDate": "2026-02-10"
3. When article publishes, change status to "published"

---

## Quick Reference

| Field | Description |
|-------|-------------|
| id | D00001, D00002, D00003... (5 digits) |
| status | "published" = visible, "scheduled" = hidden, "draft" = hidden |
| fileName | Must match actual ZIP file name |
| articleUrl | Link to the blog article (relative or absolute) |

## File Locations

| Purpose | Location |
|---------|----------|
| Source code | ai-workhack-blog\source\ |
| ZIP files | ai-workhack-blog\public\downloads\ |
| Config JSON | ai-workhack-blog\data\downloads.json |

## Categories

| Category | Description |
|----------|-------------|
| AI Tools | AI-powered automation tools |
| Data Tools | Data processing and analysis |
| Content Writing | Blog/article generation tools |
| Data Entry | PDF extraction, form processing |
| Productivity | Workflow automation |

## Security Checklist

Before creating ZIP, ensure NO:
- API keys (OpenAI, Anthropic, etc.)
- Passwords
- Local folder paths (D:\Users\...)
- Email addresses
- Personal information

## Integration with Supabase

This JSON file is for local management and backup.
The main download data is stored in Supabase downloads table.
Use publish_post.js to sync if needed.
