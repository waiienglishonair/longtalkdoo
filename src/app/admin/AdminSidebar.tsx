'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

interface SidebarProps {
    logoutAction: (formData: FormData) => Promise<void>
}

export default function AdminSidebar({ logoutAction }: SidebarProps) {
    const pathname = usePathname()

    const menuItems = [
        { icon: 'dashboard', label: 'ภาพรวม', href: '/admin' },
        { icon: 'group', label: 'ผู้ใช้', href: '/admin/users' },
        { icon: 'menu_book', label: 'คอร์สเรียน', href: '/admin/courses' },
        { icon: 'school', label: 'ผู้สอน', href: '/admin/instructors' },
        { icon: 'category', label: 'หมวดหมู่', href: '/admin/categories' },
        { icon: 'label', label: 'แท็ก', href: '/admin/tags' },
        { icon: 'settings', label: 'ตั้งค่า', href: '#' },
    ]

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    return (
        <aside className="w-64 border-r border-gray-200 bg-white flex-col hidden md:flex shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <Link href="/">
                    <h1 className="text-2xl font-[var(--font-brand)] font-extrabold text-primary">LongTalkDoo</h1>
                    <p className="text-xs font-medium text-text-sub">แผงควบคุมแอดมิน</p>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map(item => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                sidebar-link flex items-center gap-3 p-3 rounded-xl
                                transition-all duration-200 ease-out
                                active:scale-[0.97]
                                ${active
                                    ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm'
                                    : 'text-text-sub hover:text-primary hover:bg-primary/5 hover:translate-x-1 border border-transparent font-medium'
                                }
                            `}
                        >
                            <MaterialIcon name={item.icon} className={`text-xl transition-all duration-200 ${active ? 'fill-1' : ''}`} />
                            <span className="text-sm">{item.label}</span>
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <form action={logoutAction}>
                    <button type="submit" className="flex items-center gap-3 w-full p-3 rounded-lg text-text-sub hover:text-secondary hover:bg-red-50 transition-all duration-200 active:scale-[0.97]">
                        <MaterialIcon name="logout" className="text-xl" />
                        <span className="font-medium text-sm">ออกจากระบบ</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
