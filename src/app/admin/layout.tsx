import { LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-[#121212] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#1e1e1e] flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/10">
                    <Link href="/">
                        <h1 className="text-2xl font-extrabold text-[#30e86e]">LongTalkDoo</h1>
                        <p className="text-xs font-medium text-gray-400">Admin Panel</p>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active />
                    <SidebarItem icon={<Users size={20} />} label="Users" />
                    <SidebarItem icon={<BookOpen size={20} />} label="Courses" />
                    <SidebarItem icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-white/10 bg-[#1e1e1e]/50 backdrop-blur flex items-center justify-between px-6 z-10">
                    <h2 className="text-lg font-bold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#30e86e] to-[#20c055] p-0.5">
                            <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                                <span className="text-xs font-bold text-[#30e86e]">A</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Decorative Background for Main */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#30e86e] rounded-full mix-blend-multiply filter blur-[200px] opacity-10 pointer-events-none"></div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative z-10">
                    {children}
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href="#" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-[#30e86e]/10 text-[#30e86e] font-bold border border-[#30e86e]/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent font-medium'}`}>
            {icon}
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#30e86e]"></div>}
        </Link>
    )
}
