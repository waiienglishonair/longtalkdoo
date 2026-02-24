import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

async function updateRole(formData: FormData) {
    'use server'
    const supabase = createAdminClient()
    const userId = formData.get('userId') as string
    const newRole = formData.get('role') as string

    await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    revalidatePath('/admin/users')
}

export default async function AdminUsersPage() {
    const supabase = await createClient()

    // Check current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (currentProfile?.role !== 'admin') redirect('/')

    // Fetch all profiles using admin client
    const adminClient = createAdminClient()
    const { data: profiles, error } = await adminClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-1 text-text-main">จัดการผู้ใช้</h1>
                <p className="text-text-sub text-sm">ดูและแก้ไขบทบาทผู้ใช้ทั้งหมดในระบบ</p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-text-main flex items-center gap-2">
                        <MaterialIcon name="group" className="text-primary" />
                        ผู้ใช้ทั้งหมด
                        <span className="text-sm font-normal text-text-sub">({profiles?.length || 0} คน)</span>
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle text-text-sub">
                        <thead className="text-[11px] uppercase text-text-sub tracking-wider bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-4">ผู้ใช้</th>
                                <th scope="col" className="px-6 py-4">อีเมล</th>
                                <th scope="col" className="px-6 py-4">บทบาท</th>
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
                                        <td className="px-6 py-4 text-text-sub text-xs">
                                            {profile.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {profile.id !== user.id ? (
                                                <form action={updateRole}>
                                                    <input type="hidden" name="userId" value={profile.id} />
                                                    <input type="hidden" name="role" value={profile.role === 'admin' ? 'user' : 'admin'} />
                                                    <button
                                                        type="submit"
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${profile.role === 'admin'
                                                                ? 'bg-red-50 text-secondary hover:bg-red-100'
                                                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                                                            }`}
                                                    >
                                                        {profile.role === 'admin' ? 'ลดเป็นผู้ใช้' : 'เลื่อนเป็นแอดมิน'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <span className="text-xs text-text-sub italic">คุณ (ตัวเอง)</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-text-sub">
                                        {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ไม่พบผู้ใช้ในระบบ'}
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
