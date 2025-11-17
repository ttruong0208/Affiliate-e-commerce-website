
  import Link from 'next/link'
  import { ShoppingCart, Phone, Mail, MapPin } from 'lucide-react'

  export function Footer() {
    return (
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-black-900">Mẹ và Bé</span>
              </Link>
              <p className="text-gray-600">
                Website demo bán hàng trực tuyến với đa dạng sản phẩm chất lượng cao, 
                giao hàng nhanh chóng và dịch vụ khách hàng tận tình.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Liên kết nhanh</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-600 hover:text-blue-600">
                  Trang chủ
                </Link>
                <Link href="/products" className="block text-gray-600 hover:text-blue-600">
                  Sản phẩm
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Liên hệ</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">0123 456 789</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">support@shopdemo.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Hà Nội, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 Mẹ và Bé. Bản quyền thuộc về chúng tôi.</p>
          </div>
        </div>
      </footer>
    )
  }
