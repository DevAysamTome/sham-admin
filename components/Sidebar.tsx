'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdShoppingCart, MdCategory, MdHome } from 'react-icons/md';

const navItems = [
  { label: 'الرئيسية', href: '/', icon: MdHome },
  { label: 'الطلبات', href: '/orders', icon: MdShoppingCart },
  { label: 'المنتجات', href: '/products', icon: MdDashboard },
  { label: 'الأصناف', href: '/categories', icon: MdCategory },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-center">لوحة التحكم</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href ? 'bg-gray-200' : '';
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${active}`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
