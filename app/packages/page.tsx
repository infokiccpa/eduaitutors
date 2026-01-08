"use client"

import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import PackagesSection from '@/components/PackagesSection'

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="pt-8">
        <PackagesSection variant="full" />
      </main>
      <PublicFooter />
    </div>
  )
}



