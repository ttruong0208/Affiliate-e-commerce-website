
'use client'

import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { 
  Baby, 
  Coffee, 
  ShoppingCart, 
  Puzzle, 
  ShoppingBag, 
  Heart,
  Shirt,
  Droplets,
  Utensils,
  Book,
  Sparkles,
  Home
} from 'lucide-react'

const categories = [
  {
    id: 'chamsoc',
    name: 'Chăm sóc',
    icon: Baby,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'suabot',
    name: 'Sữa bột',
    icon: Coffee,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'xeday',
    name: 'Xe đẩy',
    icon: ShoppingCart,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'dochoi',
    name: 'Đồ chơi',
    icon: Puzzle,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'thoitrang',
    name: 'Thời trang bé',
    icon: Shirt,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'tagiay',
    name: 'Tã & giấy',
    icon: Droplets,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    id: 'anvat',
    name: 'Dinh dưỡng',
    icon: Utensils,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'sachvadochoi',
    name: 'Sách cho mẹ',
    icon: Book,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'me',
    name: 'Dành cho mẹ',
    icon: Heart,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'dungcuphongtan',
    name: 'Vệ sinh',
    icon: Sparkles,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'noithat',
    name: 'Nội thất',
    icon: Home,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'tuixach',
    name: 'Túi xách',
    icon: ShoppingBag,
    color: 'from-fuchsia-500 to-fuchsia-600',
    bgColor: 'bg-fuchsia-50',
  },
]

export function CategoriesGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm đa dạng với chất lượng tốt nhất
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/products?category=${category.id}`}>
                  <div className={`${category.bgColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group cursor-pointer h-32 flex flex-col justify-center`}>
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
