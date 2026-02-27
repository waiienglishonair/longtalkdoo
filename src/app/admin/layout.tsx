import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { logout } from '@/app/auth/actions'
import AdminSidebar from './AdminSidebar'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, display_name, email')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/')

    const displayName = profile?.display_name || user.email?.split('@')[0] || 'Admin'
    const initial = displayName[0].toUpperCase()

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar — client component for active state */}
            <AdminSidebar logoutAction={logout} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur flex items-center justify-between px-6 z-10 shadow-sm">
                    <h2 className="text-lg font-bold text-text-main">แดชบอร์ด</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-sub">
                            <MaterialIcon name="notifications" className="text-xl" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-dark p-0.5">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">{initial}</span>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-text-main hidden lg:block">{displayName}</span>
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
