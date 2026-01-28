'use client'

import React from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import FeaturesSection from '@/components/FeaturesSection'

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <PublicHeader />

            {/* Add padding-top to account for the fixed header */}
            <div className="pt-20">
                <FeaturesSection />
            </div>

            <PublicFooter />
        </main>
    )
}
