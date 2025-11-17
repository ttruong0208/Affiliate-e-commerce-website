'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export function HeroSection() {
  const heroUrl = '/ads.png'

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] sm:h-[600px] lg:h-[700px] w-full">
        <Image
          src={heroUrl}
          alt="Khuyến mãi cho Mẹ & Bé"
          fill
          priority
          className="object-cover object-[50%_25%]"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900">
                Giảm sốc 50% <span className="text-pink-600">thời trang thu đông</span> cho bé
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-700">
                Chỉ hôm nay! Áp dụng cho hàng ngàn sản phẩm Mẹ & Bé.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/products">
                  <Button 
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-6 
                               hover:from-pink-600 hover:to-violet-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Mua ngay
                  </Button>
                </Link>

                <div className="flex items-center rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm shadow-sm backdrop-blur">
                  <span className="font-semibold text-slate-800">SALE40</span>
                  <span className="mx-2 h-4 w-px bg-slate-300" />
                  <span className="text-slate-600">Nhập mã để giảm thêm</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                *Chỉ áp dụng hôm nay. Không cộng dồn chương trình khác.
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-lg font-bold shadow-lg">
          -50%
        </div>
      </div>

      <div className="border-t bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-3 text-sm text-slate-700">
            <Link href="/category/cham-soc" className="hover:text-pink-600 transition-colors">
              Chăm sóc bé yêu
            </Link>
            <Link href="/category/do-so-sinh" className="hover:text-pink-600 transition-colors">
              Đồ sơ sinh
            </Link>
            <Link href="/category/sua-bot" className="hover:text-pink-600 transition-colors">
              Sữa bột
            </Link>
            <Link href="/category/xe-day" className="hover:text-pink-600 transition-colors">
              Xe đẩy
            </Link>
            <Link href="/category/do-choi" className="hover:text-pink-600 transition-colors">
              Đồ chơi
            </Link>
            <Link href="/promotions" className="font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              Khuyến mãi 🔥
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}