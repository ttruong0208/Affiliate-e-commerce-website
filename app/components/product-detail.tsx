'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Star, Share2, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export type OfferVM = {
  id: string
  currentPrice: number | null
  affiliateUrl?: string | null
  url?: string | null
  inStock?: boolean | null
  stockStatus?: string | null
  merchant?: { id: string; name: string; slug?: string | null; logo?: string | null } | null
}

export type ProductDetailVM = {
  id: string
  name: string
  description?: string | null
  // price: number | null            // BỎ
  minPrice?: number | null           // THÊM: giá thấp nhất (server tính sẵn hoặc client tính)
  image?: string | null
  brand?: string | null
  stock: number
  slug?: string | null
  offers?: OfferVM[]
}

export type RelatedProductLite = {
  id: string
  name: string
  // price: number | null            // BỎ
  minPrice?: number | null           // THÊM
  image?: string | null
  brand?: string | null
  slug?: string | null
}

type ProductDetailProps = {
  product: ProductDetailVM
  relatedProducts: RelatedProductLite[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const sortedOffers = useMemo(() => {
    const offers = product.offers || []
    const withPrice = offers.filter(o => o.currentPrice != null)
    const withoutPrice = offers.filter(o => o.currentPrice == null)
    withPrice.sort((a, b) => Number(a.currentPrice) - Number(b.currentPrice))
    return [...withPrice, ...withoutPrice]
  }, [product.offers])

  // Giá tốt nhất ưu tiên từ offers; nếu không có thì dùng minPrice từ server; nếu vẫn không có → null
  const bestPrice =
    sortedOffers.length && sortedOffers[0].currentPrice != null
      ? sortedOffers[0].currentPrice
      : (typeof product.minPrice === 'number' ? product.minPrice : null)

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || undefined,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const priceLabel =
    bestPrice != null ? `${bestPrice.toLocaleString('vi-VN')}₫` : 'Chưa có giá'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden border">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ShoppingCart className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {product.brand && (
              <div className="text-gray-600 mb-2">Thương hiệu: {product.brand}</div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-blue-600">
                {priceLabel}
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">(4.8) • 125 đánh giá</span>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <Button variant="outline" size="lg" onClick={shareProduct} aria-label="Chia sẻ sản phẩm">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" aria-label="Yêu thích">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Price Comparison Table from Offers */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">So sánh giá</h2>
        {sortedOffers.length === 0 ? (
          <div className="p-4 border rounded-md text-gray-600 bg-white">
            Chưa có nơi bán cho sản phẩm này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-md overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Nơi bán</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Giá</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Tình trạng</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedOffers.map((offer) => {
                  const isBest = offer.currentPrice != null && offer.currentPrice === bestPrice
                  const priceCell =
                    offer.currentPrice != null
                      ? `${offer.currentPrice.toLocaleString('vi-VN')}₫`
                      : '—'
                  const stockLabel =
                    offer.inStock === false || offer.stockStatus === 'OUT_OF_STOCK'
                      ? 'Hết hàng'
                      : 'Còn hàng'

                  return (
                    <tr key={offer.id} className="border-t">
                      <td className="px-4 py-3 flex items-center gap-2">
                        {offer.merchant?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={offer.merchant.logo}
                            alt={offer.merchant.name || 'Merchant'}
                            className="h-6 w-6 rounded"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded bg-gray-200" />
                        )}
                        <span className="font-medium">
                          {offer.merchant?.name || '—'}
                        </span>
                        {isBest && (
                          <span className="ml-2 text-xs text-white bg-green-600 px-2 py-0.5 rounded">
                            Giá tốt nhất
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">{priceCell}</td>
                      <td className="px-4 py-3">{stockLabel}</td>
                      <td className="px-4 py-3 text-right">
                        {offer.affiliateUrl ? (
                          <Link
                            href={`/api/click?offerId=${offer.id}&productId=${product.id}&src=pdp_compare`}
                            target="_blank"
                            rel="sponsored nofollow noopener"
                            prefetch={false}
                            className="inline-block"
                          >
                            <Button className="inline-flex items-center">
                              Xem giá
                            </Button>
                          </Link>
                        ) : offer.url ? (
                          <a
                            href={offer.url}
                            target="_blank"
                            rel="nofollow noopener"
                            className="inline-block"
                          >
                            <Button variant="outline" className="inline-flex items-center">
                              Xem tại trang bán
                            </Button>
                          </a>
                        ) : (
                          <Button disabled>Chưa có link</Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Card key={rp.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <Link href={`/products/${rp.slug || rp.id}`}>
                    <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      {rp.image ? (
                        <Image
                          src={rp.image}
                          alt={rp.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {rp.name}
                    </h3>

                    <div className="text-lg font-bold text-blue-600">
                      {typeof rp.minPrice === 'number'
                        ? `${rp.minPrice.toLocaleString('vi-VN')}₫`
                        : 'Chưa có giá'}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}