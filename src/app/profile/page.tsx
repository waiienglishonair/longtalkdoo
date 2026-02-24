import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
    const initial = displayName[0].toUpperCase()
    const isAdmin = profile?.role === 'admin'

    return (
        <div className="min-h-screen bg-background text-text-main">
            <div className="fixed inset-0 z-0 pointer-events-none grid-notebook"></div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-primary text-white shadow-md">
                    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm">
                                <span className="text-primary font-[var(--font-brand)] text-lg font-bold">L</span>
                            </div>
                            <h1 className="text-xl font-[var(--font-brand)] font-bold tracking-tight">LongTalkDoo</h1>
                        </Link>
                        <Link href="/" className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1">
                            <MaterialIcon name="arrow_back" className="text-lg" />
                            กลับหน้าแรก
                        </Link>
                    </div>
                </header>

                {/* Profile Content */}
                <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Cover */}
                        <div className="h-32 bg-gradient-to-r from-primary to-primary-dark relative">
                            <div className="absolute -bottom-10 left-8">
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                    <span className="text-3xl font-bold text-primary">{initial}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-14 pb-6 px-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">{displayName}</h2>
                                    <p className="text-text-sub text-sm">{user.email}</p>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isAdmin ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-sub'
                                            }`}>
                                            <MaterialIcon name={isAdmin ? 'shield' : 'person'} className="text-sm" />
                                            {isAdmin ? 'แอดมิน' : 'ผู้ใช้'}
                                        </span>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <Link href="/admin" className="bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                                        <MaterialIcon name="dashboard" className="text-lg" />
                                        แดชบอร์ดแอดมิน
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid gap-4 mt-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                                <MaterialIcon name="info" className="text-primary" />
                                ข้อมูลบัญชี
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-sm text-text-sub">อีเมล</span>
                                    <span className="text-sm font-medium text-text-main">{user.email}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-sm text-text-sub">ชื่อที่แสดง</span>
                                    <span className="text-sm font-medium text-text-main">{displayName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-sm text-text-sub">บทบาท</span>
                                    <span className="text-sm font-medium text-text-main">{isAdmin ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-text-sub">สมัครเมื่อ</span>
                                    <span className="text-sm font-medium text-text-main">
                                        {profile?.created_at
                                            ? new Date(profile.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Logout */}
                        <form action={logout}>
                            <button type="submit" className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-secondary font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <MaterialIcon name="logout" className="text-xl" />
                                ออกจากระบบ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
