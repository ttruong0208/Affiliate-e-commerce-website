
import { ProductsPageContent } from '@/components/products-page-content'

export const metadata = {
  title: 'Danh sách sản phẩm - ShopDemo',
  description: 'Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất. Laptop, điện thoại, phụ kiện và nhiều hơn nữa.',
}

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return <ProductsPageContent searchParams={searchParams} />
}
