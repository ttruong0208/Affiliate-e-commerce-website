
'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FeaturedProducts } from '@/components/featured-products'
import { HeroSection } from '@/components/hero-section'
import { CategoriesGrid } from '@/components/categories-grid'

export function HomePageContent() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <CategoriesGrid />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  )
}
