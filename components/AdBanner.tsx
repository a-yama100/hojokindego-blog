import { createServiceClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

interface Ad {
  id: string
  title: string
  image_url: string
  link_url: string
}

interface AdBannerProps {
  siteId: string
  position: 'top' | 'sidebar' | 'article_bottom'
  className?: string
}

async function getAd(siteId: string, position: string): Promise<Ad | null> {
  try {
    const supabase = createServiceClient()
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('ads')
      .select('id, title, image_url, link_url')
      .eq('site_id', siteId)
      .eq('position', position)
      .eq('is_active', true)
      .or('start_date.is.null,start_date.lte.' + now)
      .or('end_date.is.null,end_date.gte.' + now)
      .order('sort_order', { ascending: true })
      .limit(10)
    if (!data || data.length === 0) return null
    return data[Math.floor(Math.random() * data.length)] as Ad
  } catch {
    return null
  }
}

export async function AdBanner({ siteId, position, className = '' }: AdBannerProps) {
  const ad = await getAd(siteId, position)
  if (!ad) return null

  return (
    <div className={'block ' + className}>
      <Link href={ad.link_url} target="_blank" rel="noopener noreferrer sponsored">
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 hover:opacity-90 transition-opacity">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-auto"
          />
          <span className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
            AD
          </span>
        </div>
      </Link>
    </div>
  )
}
