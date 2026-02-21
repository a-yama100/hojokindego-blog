import { AdBanner } from '@/components/AdBanner'
import { PopularPosts } from '@/components/PopularPosts'

interface SidebarProps {
  siteId: string
}

export function Sidebar({ siteId }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <AdBanner siteId={siteId} position="sidebar" className="w-full" />
      <PopularPosts />
      <AdBanner siteId={siteId} position="sidebar" className="w-full" />
    </aside>
  )
}
