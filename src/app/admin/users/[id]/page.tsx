import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateUserProfile, deleteUser } from '../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) redirect('/login')

    const adminClient = createAdminClient()

    const { data: currentProfile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

    if (currentProfile?.role !== 'admin') redirect('/')

    const { data: profile, error } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !profile) notFound()

    const { data: enrollments } = await adminClient
        .from('enrollments')
        .select(`
            *,
            courses ( id, name, slug, featured_image, price, status )
        `)
        .eq('user_id', id)
        .order('enrolled_at', { ascending: false })

    const isSelf = currentUser.id === id

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <a href="/admin/users" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </a>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-main">รายละเอียดผู้ใช้</h1>
                    <p className="text-text-sub text-sm">{profile.email}</p>
                </div>
                {isSelf && (
                    <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">คุณ (ตัวเอง)</span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <MaterialIcon name="person" className="text-primary text-lg" />
                            <h3 className="font-bold text-sm text-text-main">ข้อมูลผู้ใช้</h3>
                        </div>
                        <form action={updateUserProfile} className="p-5 space-y-4">
                            <input type="hidden" name="userId" value={profile.id} />
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">อีเมล</label>
                                <input type="email" value={profile.email} disabled className="form-input bg-gray-50 text-text-sub cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">ชื่อที่แสดง</label>
                                <input type="text" name="display_name" defaultValue={profile.display_name || ''} placeholder="ชื่อผู้ใช้" className="form-input" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">บทบาท</label>
                                <select name="role" defaultValue={profile.role} disabled={isSelf} className="form-input">
                                    <option value="user">ผู้ใช้ทั่วไป</option>
                                    <option value="admin">แอดมิน</option>
                                </select>
                                {isSelf && <p className="text-xs text-text-sub mt-1">ไม่สามารถเปลี่ยนบทบาทตัวเองได้</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">วันที่สมัคร</label>
                                <input
                                    type="text"
                                    value={profile.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    }) : '-'}
                                    disabled
                                    className="form-input bg-gray-50 text-text-sub cursor-not-allowed"
                                />
                            </div>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
                                <MaterialIcon name="save" className="text-lg" />
                                บันทึกการเปลี่ยนแปลง
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="school" className="text-primary text-lg" />
                                <h3 className="font-bold text-sm text-text-main">คอร์สที่ลงทะเบียน</h3>
                                <span className="text-xs bg-gray-100 text-text-sub px-2 py-0.5 rounded-full">
                                    {enrollments?.length || 0} คอร์ส
                                </span>
                            </div>
                        </div>
                        {enrollments && enrollments.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {enrollments.map((enrollment) => {
                                    const course = enrollment.courses as { id: string; name: string; slug: string; featured_image: string | null; price: number; status: string } | null
                                    return (
                                        <div key={enrollment.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0">
                                                {course?.featured_image ? (
                                                    <img src={course.featured_image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                                ) : (
                                                    <MaterialIcon name="menu_book" className="text-primary text-xl" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-text-main truncate">{course?.name || 'ไม่พบคอร์ส'}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <EnrollmentBadge status={enrollment.status} />
                                                    <span className="text-xs text-text-sub">
                                                        ลงทะเบียน: {new Date(enrollment.enrolled_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-sm font-bold text-text-main">{Number(enrollment.progress).toFixed(0)}%</div>
                                                <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all"
                                                        style={{ width: `${Math.min(Number(enrollment.progress), 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-text-sub text-sm">
                                ยังไม่ได้ลงทะเบียนคอร์สใดๆ
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                        <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold ${profile.role === 'admin' ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                            {(profile.display_name || profile.email || '?')[0].toUpperCase()}
                        </div>
                        <h3 className="font-bold text-lg text-text-main mt-4">
                            {profile.display_name || profile.email?.split('@')[0]}
                        </h3>
                        <p className="text-sm text-text-sub">{profile.email}</p>
                        <div className="mt-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${profile.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-sub'}`}>
                                <MaterialIcon name={profile.role === 'admin' ? 'shield' : 'person'} className="text-sm" />
                                {profile.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-sm text-text-main">สถิติ</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <StatRow icon="school" label="คอร์สทั้งหมด" value={`${enrollments?.length || 0}`} />
                            <StatRow icon="check_circle" label="เรียนจบ" value={`${enrollments?.filter(e => e.status === 'completed').length || 0}`} />
                            <StatRow icon="schedule" label="กำลังเรียน" value={`${enrollments?.filter(e => e.status === 'active').length || 0}`} />
                        </div>
                    </div>

                    {!isSelf && (
                        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                            <h3 className="font-bold text-sm text-secondary mb-2 flex items-center gap-2">
                                <MaterialIcon name="warning" className="text-lg" />
                                Danger Zone
                            </h3>
                            <p className="text-xs text-red-700 mb-4">ลบผู้ใช้ถาวร รวมถึงข้อมูลการลงทะเบียนทั้งหมด</p>
                            <form action={deleteUser}>
                                <input type="hidden" name="userId" value={profile.id} />
                                <button type="submit" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                                    <MaterialIcon name="delete_forever" className="text-lg" />
                                    ลบผู้ใช้นี้ถาวร
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function EnrollmentBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: 'bg-green-50 text-green-600',
        completed: 'bg-blue-50 text-blue-600',
        cancelled: 'bg-red-50 text-red-500',
        expired: 'bg-gray-100 text-gray-500',
    }
    const labels: Record<string, string> = {
        active: 'กำลังเรียน',
        completed: 'เรียนจบ',
        cancelled: 'ยกเลิก',
        expired: 'หมดอายุ',
    }
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[status] || styles.active}`}>
            {labels[status] || status}
        </span>
    )
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-sub">
                <MaterialIcon name={icon} className="text-sm" />
                <span className="text-xs">{label}</span>
            </div>
            <span className="text-sm font-bold text-text-main">{value}</span>
        </div>
    )
}
