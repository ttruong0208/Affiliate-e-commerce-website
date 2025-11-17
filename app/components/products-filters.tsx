'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, X } from 'lucide-react'

const categories = [
  { id: 'all', name: 'Tất cả sản phẩm' },
  { id: 'cham-soc', name: 'Chăm sóc' },
  { id: 'sua-bot', name: 'Sữa bột' },
  { id: 'ta-giay', name: 'Tã & giấy' },
  { id: 'do-choi', name: 'Đồ chơi' },
  { id: 'thoi-trang-be', name: 'Thời trang bé' },
  { id: 'dinh-duong', name: 'Dinh dưỡng' },
  { id: 've-sinh', name: 'Vệ sinh' },
  { id: 'noi-that', name: 'Nội thất' },
  { id: 'tui-xach', name: 'Túi xách' },
  { id: 'sach-cho-me', name: 'Sách cho mẹ' },
  { id: 'danh-cho-me', name: 'Dành cho mẹ' },
]

const priceRanges = [
  { id: 'all', name: 'Tất cả mức giá', min: 0, max: null },
  { id: 'under-100k', name: 'Dưới 100.000đ', min: 0, max: 100000 },
  { id: '100k-300k', name: '100.000 - 300.000đ', min: 100000, max: 300000 },
  { id: '300k-500k', name: '300.000 - 500.000đ', min: 300000, max: 500000 },
  { id: '500k-1m', name: '500.000 - 1.000.000đ', min: 500000, max: 1000000 },
  { id: 'over-1m', name: 'Trên 1.000.000đ', min: 1000000, max: null },
]

export function ProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all')
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams?.get('priceRange') || 'all')

  const updateFilters = (updates: Record<string, string>) => {
    const current = new URLSearchParams(searchParams?.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') current.delete(key)
      else current.set(key, value)
    })

    // reset trang khi thay đổi filter
    current.delete('page')

    const search = current.toString()
    router.push(`/products${search ? `?${search}` : ''}`)
  }

  const handleSearch = () => updateFilters({ search: searchTerm })
  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id)
    updateFilters({ category: id })
  }
  const handlePriceRangeChange = (id: string) => {
    setSelectedPriceRange(id)
    updateFilters({ priceRange: id })
  }

  const clearAll = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    router.push('/products')
  }

  const hasFilters =
    !!searchTerm ||
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all'

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price */}
      <Card>
        <CardHeader>
          <CardTitle>Khoảng giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => handlePriceRangeChange(range.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedPriceRange === range.id
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear */}
      {hasFilters && (
        <Button
          variant="outline"
          onClick={clearAll}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  )
}
