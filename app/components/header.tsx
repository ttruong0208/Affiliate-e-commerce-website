"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo + main nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-gray-900">Mẹ và Bé</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">Trang chủ</Link>
              <Link href="/blog" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">Bài viết</Link>
            </nav>
          </div>

          {/* Center: search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right: support/contact + auth actions + mobile menu */}
          <div className="flex items-center gap-4">
            {/* Support & Contact (desktop) */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/support" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">Hỗ trợ</Link>
              <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">Liên hệ</Link>
            </nav>

            {/* Auth */}
            {status === "loading" ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
              </div>
            ) : session ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/profile">
                  <button className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" />
                    Hồ sơ
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 rounded-md text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/login">
                  <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md">Đăng nhập</button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700">Đăng ký</button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t">
          <div className="flex flex-col space-y-3 px-4">
            <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium">Trang chủ</Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium">Sản phẩm</Link>
            <Link href="/blog" className="text-gray-700 hover:text-pink-600 font-medium">Bài viết</Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 font-medium">Liên hệ</Link>
            <Link href="/support" className="text-gray-700 hover:text-pink-600 font-medium">Hỗ trợ</Link>

            {session ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-pink-600 font-medium">Tài khoản</Link>
                <button className="w-full px-3 py-2 border rounded-md text-left" onClick={() => signOut()}>Đăng xuất</button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/login"><button className="flex-1 px-3 py-2 rounded-md border">Đăng nhập</button></Link>
                <Link href="/auth/register"><button className="flex-1 px-3 py-2 rounded-md bg-pink-600 text-white">Đăng ký</button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}