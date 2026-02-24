import Link from 'next/link'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col hidden md:flex shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/">
                        <h1 className="text-2xl font-[var(--font-brand)] font-extrabold text-primary">LongTalkDoo</h1>
                        <p className="text-xs font-medium text-text-sub">แผงควบคุมแอดมิน</p>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <SidebarItem icon="dashboard" label="ภาพรวม" active />
                    <SidebarItem icon="group" label="ผู้ใช้" />
                    <SidebarItem icon="menu_book" label="คอร์สเรียน" />
                    <SidebarItem icon="settings" label="ตั้งค่า" />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg text-text-sub hover:text-secondary hover:bg-red-50 transition-colors">
                        <MaterialIcon name="logout" className="text-xl" />
                        <span className="font-medium">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur flex items-center justify-between px-6 z-10 shadow-sm">
                    <h2 className="text-lg font-bold text-text-main">แดชบอร์ด</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-sub">
                            <MaterialIcon name="notifications" className="text-xl" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-dark p-0.5">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 hide-scrollbar relative z-10 bg-gray-50">
                    {children}
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
    return (
        <Link href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-text-sub hover:text-primary hover:bg-primary/5 border border-transparent font-medium'}`}>
            <MaterialIcon name={icon} className={`text-xl ${active ? 'fill-1' : ''}`} />
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
        </Link>
    )
}
