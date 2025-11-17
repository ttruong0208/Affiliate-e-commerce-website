'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetail } from '@/components/product-detail'

// Kiểu dữ liệu cho UI (đã serialize), phù hợp mô hình affiliate (giá nằm ở offers)
export interface ProductDetailVM {
  id: string
  name: string
  description?: string | null
  // price: number | null   // BỎ
  minPrice?: number | null // thêm: giá thấp nhất từ offers (có thể null)
  image?: string | null
  brand?: string | null
  stock: number
  // slug?: string | null
  // createdAt?: string
}

export interface RelatedProductLite {
  id: string
  name: string
  // price: number | null   // BỎ
  minPrice?: number | null // optional cho related
  image?: string | null
  brand?: string | null
  stock: number
  // slug?: string | null
  // createdAt?: string
}

interface ProductDetailPageContentProps {
  product: ProductDetailVM
  relatedProducts: RelatedProductLite[]
}

export function ProductDetailPageContent({ product, relatedProducts }: ProductDetailPageContentProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  )
}