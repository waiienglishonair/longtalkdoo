import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { updateUserRole } from './actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; role?: string }>
}) {
    const params = await searchParams
    const searchQuery = params.search || ''
    const roleFilter = params.role || 'all'

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentProfile?.role !== 'admin') redirect('/')

    const adminClient = createAdminClient()

    let query = adminClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter)
    }

    if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    }

    const { data: profiles, error } = await query

    const { data: enrollmentCounts } = await adminClient
        .from('enrollments')
        .select('user_id')

    const enrollMap = new Map<string, number>()
    enrollmentCounts?.forEach(e => {
        enrollMap.set(e.user_id, (enrollMap.get(e.user_id) || 0) + 1)
    })

    const { count: totalCount } = await adminClient.from('profiles').select('*', { count: 'exact', head: true })
    const { count: adminCount } = await adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
    const { count: userCount } = await adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user')

    const tabs = [
        { key: 'all', label: 'ทั้งหมด', count: totalCount || 0 },
        { key: 'admin', label: 'แอดมิน', count: adminCount || 0 },
        { key: 'user', label: 'ผู้ใช้ทั่วไป', count: userCount || 0 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-text-main">จัดการผู้ใช้</h1>
                    <p className="text-text-sub text-sm">ดูและแก้ไขบทบาทผู้ใช้ทั้งหมดในระบบ</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-sub bg-gray-100 px-4 py-2 rounded-xl">
                    <MaterialIcon name="group" className="text-primary text-lg" />
                    <span className="font-bold text-text-main">{totalCount || 0}</span> ผู้ใช้ทั้งหมด
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    {tabs.map(tab => (
                        <Link
                            key={tab.key}
                            href={`/admin/users${tab.key === 'all' ? '' : `?role=${tab.key}`}`}
                            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${roleFilter === tab.key
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-text-sub hover:text-primary hover:border-primary/30'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${roleFilter === tab.key
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {tab.count}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-b border-gray-100">
                    <form method="GET" action="/admin/users" className="flex gap-3">
                        {roleFilter !== 'all' && <input type="hidden" name="role" value={roleFilter} />}
                        <div className="relative flex-1">
                            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="ค้นหาชื่อ, อีเมล..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-text-sub hover:bg-gray-200 transition-colors">
                            ค้นหา
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle text-text-sub">
                        <thead className="text-[11px] uppercase text-text-sub tracking-wider bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-4">ผู้ใช้</th>
                                <th scope="col" className="px-6 py-4">อีเมล</th>
                                <th scope="col" className="px-6 py-4">บทบาท</th>
                                <th scope="col" className="px-6 py-4">คอร์ส</th>
                                <th scope="col" className="px-6 py-4">วันที่สมัคร</th>
                                <th scope="col" className="px-6 py-4">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles && profiles.length > 0 ? (
                                profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-main">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${profile.role === 'admin' ? 'bg-primary' : 'bg-gray-400'}`}>
                                                    {(profile.display_name || profile.email || '?')[0].toUpperCase()}
                                                </div>
                                                <span>{profile.display_name || profile.email?.split('@')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-sub">{profile.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${profile.role === 'admin'
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-gray-100 text-text-sub'
                                                }`}>
                                                <MaterialIcon name={profile.role === 'admin' ? 'shield' : 'person'} className="text-sm" />
                                                {profile.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">{enrollMap.get(profile.id) || 0} คอร์ส</span>
                                        </td>
                                        <td className="px-6 py-4 text-text-sub text-xs">
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/users/${profile.id}`}
                                                    className="p-1.5 rounded-lg text-text-sub hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <MaterialIcon name="visibility" className="text-lg" />
                                                </Link>
                                                {profile.id !== user.id && (
                                                    <form action={updateUserRole}>
                                                        <input type="hidden" name="userId" value={profile.id} />
                                                        <input type="hidden" name="role" value={profile.role === 'admin' ? 'user' : 'admin'} />
                                                        <button
                                                            type="submit"
                                                            className={`p-1.5 rounded-lg transition-colors ${profile.role === 'admin'
                                                                ? 'text-secondary hover:bg-red-50'
                                                                : 'text-text-sub hover:text-primary hover:bg-primary/10'
                                                                }`}
                                                            title={profile.role === 'admin' ? 'ลดเป็นผู้ใช้' : 'เลื่อนเป็นแอดมิน'}
                                                        >
                                                            <MaterialIcon
                                                                name={profile.role === 'admin' ? 'remove_moderator' : 'add_moderator'}
                                                                className="text-lg"
                                                            />
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                <MaterialIcon name="group" className="text-3xl text-gray-400" />
                                            </div>
                                            <p className="text-text-sub font-medium">
                                                {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ไม่พบผู้ใช้ในระบบ'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
