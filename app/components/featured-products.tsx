'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingCart, Star, ExternalLink, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

type Offer = {
  id: string
  affiliateUrl?: string | null
  currentPrice?: number | null
  merchant?: { name: string; slug: string; logo?: string | null; domain?: string | null } | null
}

type CategoryLite = {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  slug?: string | null
  name: string
  image?: string | null
  images?: string | null // server đang trả String? cho images
  category?: CategoryLite | null
  stock: number
  isActive?: boolean
  offers?: Offer[]
  minPrice?: number | null // thêm để nhận từ API
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=6', { cache: 'no-store' })
      const json = await res.json()
      if (json?.success) {
        setProducts(Array.isArray(json.data) ? json.data : [])
      } else {
        console.error('API error:', json)
        setProducts([])
      }
    } catch (e) {
      console.error('Error fetching featured products:', e)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatVND = (n: number) =>
    n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được khách hàng yêu thích nhất với chất lượng đảm bảo
          </p>
        </motion.div>

        {products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              // Offer có giá thấp nhất
              const bestOffer =
                (product.offers || [])
                  .filter(o => o && (o.currentPrice ?? null) !== null)
                  .sort((a, b) => (Number(a.currentPrice) || Infinity) - (Number(b.currentPrice) || Infinity))[0]

              // Ưu tiên bestOffer.currentPrice → nếu không có, dùng minPrice từ API → nếu vẫn không có, null
              const displayPrice =
                typeof bestOffer?.currentPrice === 'number'
                  ? bestOffer.currentPrice
                  : (typeof product.minPrice === 'number' ? product.minPrice : null)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Hết hàng</span>
                          </div>
                        )}
                        {bestOffer && (
                          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                            Giá tốt
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-red-600">
                              {displayPrice != null
                                ? formatVND(displayPrice)
                                : 'Chưa có giá'}
                            </div>
                          </div>
                          {product.offers && product.offers.length > 1 && (
                            <div className="text-sm text-pink-600 font-medium">
                              +{product.offers.length - 1} nơi bán
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 space-x-2">
                      <Link href={`/products/${product.slug || product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Button>
                      </Link>

                      {bestOffer ? (
                        <Link
                          href={`/api/click?offerId=${bestOffer.id}&productId=${product.id}&src=home_featured`}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          prefetch={false}
                          className="flex-1"
                        >
                         <Button className="w-full bg-pink-600 hover:bg-pink-700">
  <ExternalLink className="w-4 h-4 mr-2" />
  Xem giá
</Button>
                        </Link>
                      ) : (
                        <Button disabled className="flex-1">Chưa có giá</Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Chưa có sản phẩm nào.</p>
            <Link href="/products">
              <Button className="mt-4">Khám phá sản phẩm</Button>
            </Link>
          </div>
        )}

        {products?.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/products">
              <Button size="lg" variant="outline">Xem tất cả sản phẩm</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}