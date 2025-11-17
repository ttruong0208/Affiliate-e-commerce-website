import Link from 'next/link'
import { prisma } from '@/lib/db'
import ProductsClientControls from './products-controls/page'
import DeleteButton from './delete-button/page'
type SearchParams = {
  page?: string
  q?: string
}

type ProductRow = {
  id: string
  name: string
  slug: string
  brand: string | null
  stock: number
  isActive: boolean
  createdAt: Date
  _count: { offers: number }
}

function formatPrice(val: unknown) {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'number') return val.toLocaleString('vi-VN')
  if (typeof val === 'string') {
    const n = Number(val)
    return Number.isFinite(n) ? n.toLocaleString('vi-VN') : '-'
  }
  // Prisma.Decimal object cases
  const anyVal = val as any
  if (typeof anyVal?.toNumber === 'function') {
    const n = Number(anyVal.toNumber())
    return Number.isFinite(n) ? n.toLocaleString('vi-VN') : '-'
  }
  if (typeof anyVal?.toString === 'function') {
    const n = Number(anyVal.toString())
    return Number.isFinite(n) ? n.toLocaleString('vi-VN') : '-'
  }
  return '-'
}

async function getProducts({ page = '1', q = '' }: SearchParams) {
  const take = 10
  const currentPage = Math.max(1, Number(page) || 1)
  const where =
    q?.trim()
      ? { isActive: true, name: { contains: q.trim(), mode: 'insensitive' as const } }
      : { isActive: true }

  const [itemsRaw, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip: (currentPage - 1) * take,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        stock: true,
        isActive: true,
        createdAt: true,
        _count: { select: { offers: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  const items = itemsRaw as unknown as ProductRow[]
  const totalPages = Math.max(1, Math.ceil(total / take))
  return { items, total, currentPage, totalPages, q }
}

export default async function AdminHome({ searchParams }: { searchParams: SearchParams }) {
  const { items, total, currentPage, totalPages, q } = await getProducts(searchParams)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex items-center gap-2">
          <Link className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" href="/admin/products/">
            + Thêm sản phẩm
          </Link>
          <Link className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700" href="/admin/offers/">
            + Thêm offer
          </Link>
          <Link className="rounded border px-3 py-2 text-gray-700 hover:bg-gray-50" href="/admin/clicks">
  Thống kê click
</Link>
        </div>
      </div>

      <ProductsClientControls initialQuery={q || ''} page={currentPage} totalPages={totalPages} />

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Tên</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tồn</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Offers</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Ngày tạo</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={9}>
                  Không có sản phẩm nào.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{p.name}</td>
                  <td className="px-4 py-3">
                    <div className="max-w-[280px] truncate font-medium text-gray-900">{p.name}</div>
                  </td>
                  
                  
                  <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {p._count.offers}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                        target="_blank"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                      >
                        Sửa
                      </Link>
                      <DeleteButton slug={p.slug} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Tổng: {total.toLocaleString('vi-VN')} sản phẩm</div>
        <Pagination currentPage={currentPage} totalPages={totalPages} q={q || ''} />
      </div>
    </div>
  )
}

function Pagination({ currentPage, totalPages, q }: { currentPage: number; totalPages: number; q: string }) {
  const makeHref = (p: number) => (q ? `/admin?page=${p}&q=${encodeURIComponent(q)}` : `/admin?page=${p}`)
  return (
    <div className="flex items-center gap-2">
      <Link
        href={makeHref(Math.max(1, currentPage - 1))}
        className={`rounded border px-3 py-1 ${currentPage === 1 ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
      >
        ← Trước
      </Link>
      <span className="rounded bg-gray-100 px-2 py-1">
        {currentPage} / {totalPages}
      </span>
      <Link
        href={makeHref(Math.min(totalPages, currentPage + 1))}
        className={`rounded border px-3 py-1 ${currentPage === totalPages ? 'pointer-events-none border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
      >
        Sau →
      </Link>
    </div>
  )
}