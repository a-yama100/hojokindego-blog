const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim().replace(/^["']+|["']+$/g, '');
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = env.R2_PUBLIC_URL;
const R2_ENDPOINT = env.R2_ENDPOINT;
const SITE_ID = env.NEXT_PUBLIC_SITE_ID || 'ai-workhack';
const SITE_URL = env.NEXT_PUBLIC_SITE_URL || 'https://ai-workhack.com';

// Load site config for tags
const siteConfigPath = path.join(__dirname, 'site-config.json');
const siteConfig = fs.existsSync(siteConfigPath) ? JSON.parse(fs.readFileSync(siteConfigPath, 'utf8')) : {};

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env.local');
  process.exit(1);
}

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL || !R2_ENDPOINT) {
  console.error('Missing R2 config in .env.local');
  console.error('Required: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL, R2_ENDPOINT');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// AWS Signature V4 for R2
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

async function uploadToR2(filePath, r2Key) {
  const fileContent = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif',
    '.webp': 'image/webp', '.svg': 'image/svg+xml',
  };
  const contentType = contentTypeMap[ext] || 'application/octet-stream';

  const url = new URL(R2_ENDPOINT);
  const host = url.hostname;
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const shortDate = dateStamp.substring(0, 8);
  const region = 'auto';
  const service = 's3';
  const payloadHash = crypto.createHash('sha256').update(fileContent).digest('hex');

  const canonicalUri = '/' + R2_BUCKET_NAME + '/' + r2Key;
  const canonicalQueryString = '';
  const canonicalHeaders = 'content-type:' + contentType + '\n' +
    'host:' + host + '\n' +
    'x-amz-content-sha256:' + payloadHash + '\n' +
    'x-amz-date:' + dateStamp + '\n';
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = 'PUT\n' + canonicalUri + '\n' + canonicalQueryString + '\n' +
    canonicalHeaders + '\n' + signedHeaders + '\n' + payloadHash;

  const credentialScope = shortDate + '/' + region + '/' + service + '/aws4_request';
  const stringToSign = 'AWS4-HMAC-SHA256\n' + dateStamp + '\n' + credentialScope + '\n' +
    crypto.createHash('sha256').update(canonicalRequest).digest('hex');

  const signingKey = getSignatureKey(R2_SECRET_ACCESS_KEY, shortDate, region, service);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const authorizationHeader = 'AWS4-HMAC-SHA256 Credential=' + R2_ACCESS_KEY_ID + '/' +
    credentialScope + ', SignedHeaders=' + signedHeaders + ', Signature=' + signature;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: 443,
      path: canonicalUri,
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileContent.length,
        'Host': host,
        'X-Amz-Content-Sha256': payloadHash,
        'X-Amz-Date': dateStamp,
        'Authorization': authorizationHeader,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(R2_PUBLIC_URL + '/' + r2Key);
        } else {
          reject(new Error('R2 upload failed (' + res.statusCode + '): ' + body));
        }
      });
    });
    req.on('error', reject);
    // Convert a stalled socket into a (retryable) timeout error instead of hanging forever.
    req.setTimeout(30000, () => {
      const e = new Error('R2 upload timed out for ' + r2Key);
      e.code = 'ETIMEDOUT';
      req.destroy(e);
    });
    req.write(fileContent);
    req.end();
  });
}

// R2 / Cloudflare occasionally resets a connection mid-upload (read ECONNRESET).
// Retry transient network failures (resets / timeouts / 5xx) with exponential backoff;
// a single retry almost always succeeds. Non-transient errors (auth, 4xx) fail fast.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function isTransientUploadError(err) {
  const code = (err && err.code) || '';
  const msg = (err && err.message) || '';
  const transientCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EPIPE', 'EAI_AGAIN', 'ENOTFOUND', 'ESOCKETTIMEDOUT'];
  if (transientCodes.includes(code)) return true;
  if (/socket hang up|ECONNRESET|timed out|timeout|EPIPE/i.test(msg)) return true;
  if (/R2 upload failed \((408|429|500|502|503|504)\)/.test(msg)) return true;
  return false;
}

async function uploadToR2WithRetry(filePath, r2Key, maxAttempts = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await uploadToR2(filePath, r2Key);
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts && isTransientUploadError(err)) {
        const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // 1s, 2s, 4s, 8s
        console.warn('  Upload attempt ' + attempt + '/' + maxAttempts + ' for ' + r2Key +
          ' failed (' + (err.code || err.message) + '). Retrying in ' + backoff + 'ms...');
        await sleep(backoff);
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr;
}

// Parse frontmatter from post.md
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: match[2] };
}

// Find images in markdown content
function findImages(content) {
  const images = [];
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const filename = match[1];
    if (!filename.startsWith('http')) {
      images.push(filename);
    }
  }

  return images;
}

// Main function
async function publishPost(postFolder) {
  const postDir = path.join(__dirname, '_posts', postFolder);
  const postPath = path.join(postDir, 'post.md');

  if (!fs.existsSync(postPath)) {
    console.error('post.md not found in', postDir);
    process.exit(1);
  }

  console.log('Reading post.md...');
  const rawContent = fs.readFileSync(postPath, 'utf8');
  const { frontmatter, content } = parseFrontmatter(rawContent);

  console.log('Title:', frontmatter.title);
  console.log('Slug:', frontmatter.slug);

  // Find and upload images
  const images = findImages(content);
  if (frontmatter.cover_image) {
    if (!images.includes(frontmatter.cover_image)) {
      images.unshift(frontmatter.cover_image);
    }
  }
  console.log('Found images:', images);

  let processedContent = content;
  const uploadedImages = {};

  for (const img of images) {
    const imgPath = path.join(postDir, img);
    if (fs.existsSync(imgPath)) {
      console.log('Uploading:', img);
      const r2Key = 'blog/' + frontmatter.slug + '/' + img;
      try {
        const url = await uploadToR2WithRetry(imgPath, r2Key);
        uploadedImages[img] = url;
        console.log('Uploaded:', url);

        // Replace image paths in content
        processedContent = processedContent.split(img).join(url);
      } catch (err) {
        console.error('Upload failed for', img, ':', err.message);
        process.exit(1);
      }
    } else {
      console.warn('Image not found:', imgPath);
    }
  }

  // Get cover image URL
  const coverImageUrl = frontmatter.cover_image ? uploadedImages[frontmatter.cover_image] : null;

  // Prepare post data
  const postData = {
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.excerpt || null,
    content: processedContent,
    thumbnail_url: coverImageUrl,
    category: frontmatter.category || null,
    is_published: frontmatter.is_published === true,
    is_premium: frontmatter.access_level === 'paid',
    required_plan: frontmatter.access_level === 'paid' ? 'light' : 'free',
    published_at: frontmatter.published_at || new Date().toISOString(),
    access_level: frontmatter.access_level || 'free',
    download_id: frontmatter.download_id || null,
    cover_image: coverImageUrl,
      site_id: SITE_ID,
      site_tags: siteConfig.siteTags || [],
  };

  // Check if post exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', frontmatter.slug)
    .single();

  let result;
  if (existing) {
    console.log('Updating existing post...');
    postData.updated_at = new Date().toISOString();
    postData.deleted_at = null;
    result = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('slug', frontmatter.slug);
  } else {
    console.log('Creating new post...');
    result = await supabase
      .from('blog_posts')
      .insert(postData);
  }

  if (result.error) {
    console.error('Error:', result.error);
    process.exit(1);
  }

  console.log('Post created successfully!');
  console.log('Done! View at: ' + SITE_URL + '/blog/' + frontmatter.slug);
}

// Run
const postFolder = process.argv[2];
if (!postFolder) {
  console.error('Usage: node publish_post.js <post-folder>');
  console.error('Example: node publish_post.js 2026-02-01-my-first-post');
  process.exit(1);
}

publishPost(postFolder).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
