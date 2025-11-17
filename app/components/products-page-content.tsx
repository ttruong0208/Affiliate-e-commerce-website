'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

type CategoryLite = { id: string; name: string; slug: string }
type MerchantLite = { id: string; name: string; slug: string; logo?: string | null; domain?: string | null }

export type ProductListItem = {
  id: string
  slug: string | null
  name: string
  description: string | null
  image: string | null
  brand: string | null
  stock: number
  category: CategoryLite | null
  offerCount: number
  minPrice: number | null
  minPriceMerchant: MerchantLite | null
  createdAt?: string
  updatedAt?: string
}

type ApiResponse = {
  success: boolean
  data: ProductListItem[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

type Props = {
  searchParams?: {
    category?: string
    search?: string
    page?: string
  }
}

const PAGE_SIZE = 6

function formatVND(n?: number | null) {
  if (typeof n !== 'number') return 'Chưa có giá'
  try {
    return `${n.toLocaleString('vi-VN')}₫`
  } catch {
    return `${Math.round(n)}₫`
  }
}

export function ProductsPageContent({ searchParams }: Props) {
  const router = useRouter()
  const urlParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ProductListItem[]>([])
  const [page, setPage] = useState<number>(Number(searchParams?.page ?? urlParams.get('page') ?? 1) || 1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)

  const [search, setSearch] = useState<string>(searchParams?.search ?? urlParams.get('search') ?? '')
  const [category, setCategory] = useState<string>(searchParams?.category ?? urlParams.get('category') ?? 'all')

  // ✅ Danh mục mẹ & bé (cập nhật theo seed.sql)
  const categories = useMemo(() => [
    { slug: 'all', label: 'Tất cả sản phẩm' },
    { slug: 'cham-soc', label: 'Chăm sóc' },
    { slug: 'sua-bot', label: 'Sữa bột' },
    { slug: 'ta-giay', label: 'Tã & Giấy' },
    { slug: 'do-choi', label: 'Đồ chơi' },
    { slug: 'thoi-trang-be', label: 'Thời trang bé' },
    { slug: 'dinh-duong', label: 'Dinh dưỡng' },
    { slug: 've-sinh', label: 'Vệ sinh' },
    { slug: 'noi-that', label: 'Nội thất' },
    { slug: 'tui-xach', label: 'Túi xách' },
    { slug: 'sach-cho-me', label: 'Sách cho mẹ' },
    { slug: 'danh-cho-me', label: 'Dành cho mẹ' },
  ], [])

  // Build query string (thêm pageSize)
  const queryString = useMemo(() => {
    const qs = new URLSearchParams()
    if (search) qs.set('search', search)
    if (category && category !== 'all') qs.set('category', category)
    if (page && page > 1) qs.set('page', String(page))
    qs.set('pageSize', String(PAGE_SIZE))
    return qs.toString()
  }, [search, category, page])

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/products?${queryString}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: ApiResponse = await res.json()
        if (!ignore) {
          setItems(json.data || [])
          setPage(json.pagination.page)
          setTotalPages(json.pagination.totalPages)
          setTotalCount(json.pagination.totalCount)
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || 'Lỗi tải danh sách sản phẩm')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()

    // Cập nhật URL (không reload)
    router.replace(queryString ? `/products?${queryString}` : '/products', { scroll: false })
    return () => { ignore = true }
  }, [queryString, router])

  // handlers
  function applySearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
  }

  function changeCategory(next: string) {
    setCategory(next)
    setPage(1)
  }

  function goto(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">Sản phẩm</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sản phẩm Mẹ & Bé
            </h1>
            <p className="text-gray-600">
              Khám phá hàng ngàn sản phẩm chăm sóc mẹ và bé chất lượng cao
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
              {/* Search box */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900">Tìm kiếm</h3>
                </div>
                <form onSubmit={applySearch} className="flex gap-3">
                  <Input
                    placeholder="Nhập tên sản phẩm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                  <Button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700">
                    Tìm
                  </Button>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M4 9h16M6 14h12M9 19h6" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900">Danh mục</h3>
                </div>
                <div className="space-y-1">
                  {categories.map(({ slug, label }) => {
                    const active = category === slug || (slug === 'all' && category === 'all')
                    return (
                      <button
                        key={slug}
                        onClick={() => changeCategory(slug)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                          active
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            {/* Main section */}
            <section className="flex-1">
              {error && (
                <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((p) => {
                  const href = `/products/${p.slug || p.id}`
                  return (
                    <Card key={p.id} className="group hover:shadow-lg transition shadow-sm border-gray-200 rounded-2xl">
                      <CardContent className="p-5">
                        <Link href={href}>
                          <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden mb-4">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                className="object-contain bg-white group-hover:scale-[1.02] transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 text-[16px] leading-6 line-clamp-2 mb-2 group-hover:text-blue-600">
                            {p.name}
                          </h3>

                          <div className="text-blue-600 font-bold text-[18px]">{formatVND(p.minPrice)}</div>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Empty */}
              {!loading && !error && items.length === 0 && (
                <div className="p-4 border rounded bg-white mt-6 text-center text-gray-600">
                  Không tìm thấy sản phẩm.
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" onClick={() => goto(page - 1)} disabled={page <= 1}>
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {page}/{totalPages}
                  </span>
                  <Button variant="outline" onClick={() => goto(page + 1)} disabled={page >= totalPages}>
                    Sau
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
