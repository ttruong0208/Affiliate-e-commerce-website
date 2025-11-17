'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingCart, Star, Eye, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

type Offer = {
  id: string
  affiliateUrl?: string | null
}

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  image?: string | null
  category?: string | null
  stock: number
  slug?: string | null
  isActive: boolean
  offers?: Offer[] 
}

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

interface ProductsGridProps {
  searchParams: SearchParams
}

export function ProductsGrid({ searchParams }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchParams.category && searchParams.category !== 'all') params.set('category', searchParams.category)
      if (searchParams.search) params.set('search', searchParams.search)
      if (searchParams.page) params.set('page', searchParams.page)

      // API sẽ trả kèm offers (xem mục 2)
      const response = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
      const data = await response.json()
      if (data.success) {
        setProducts(data.data || [])
        setPagination(data.pagination || {})
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
      const data = await response.json()
      if (!data.success) console.error('Failed to add to cart:', data.error)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Hiển thị {products?.length || 0} trong tổng số {pagination.totalCount || 0} sản phẩm
        </p>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option>Sắp xếp theo</option>
          <option>Giá thấp đến cao</option>
          <option>Giá cao đến thấp</option>
          <option>Tên A-Z</option>
          <option>Mới nhất</option>
        </select>
      </div>

      {products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const offer = product.offers?.[0] // chọn offer đầu (có thể chọn theo best price)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
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
                          <div className="text-2xl font-bold text-blue-600">
                            {product.price?.toLocaleString('vi-VN')}₫
                          </div>
                          {product.category && (
                            <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Còn {product.stock} sp</div>
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

                    {offer ? (
                      <Link
                        href={`/r/${offer.id}?src=plp&p=pos1`}
                        target="_blank"
                        rel="sponsored nofollow"
                        prefetch={false}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Xem giá (affiliate)
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mua ngay
                      </Button>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      {pagination?.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNumber = index + 1
              const isActive = pageNumber === pagination.page
              return (
                <Link
                  key={pageNumber}
                  href={`/products?${new URLSearchParams({
                    ...searchParams,
                    page: pageNumber.toString(),
                  }).toString()}`}
                >
                  <Button variant={isActive ? 'default' : 'outline'} size="sm">
                    {pageNumber}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
