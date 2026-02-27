import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { toggleCourseStatus, deleteCourse } from './actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminCoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; search?: string }>
}) {
    const params = await searchParams
    const statusFilter = params.status || 'all'
    const searchQuery = params.search || ''

    const supabase = createAdminClient()

    let query = supabase
        .from('courses')
        .select(`
            *,
            course_categories ( category_id, categories ( name ) ),
            enrollments ( id )
        `)
        .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
    }

    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data: courses, error } = await query

    const { count: allCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
    const { count: publishedCount } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published')
    const { count: draftCount } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'draft')
    const { count: archivedCount } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'archived')

    const tabs = [
        { key: 'all', label: 'ทั้งหมด', count: allCount || 0 },
        { key: 'published', label: 'เผยแพร่', count: publishedCount || 0 },
        { key: 'draft', label: 'ฉบับร่าง', count: draftCount || 0 },
        { key: 'archived', label: 'เก็บถาวร', count: archivedCount || 0 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-text-main">คอร์สเรียน</h1>
                    <p className="text-text-sub text-sm">จัดการคอร์สเรียนและสินค้าทั้งหมด</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <MaterialIcon name="add" className="text-lg" />
                    เพิ่มคอร์สใหม่
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    {tabs.map(tab => (
                        <Link
                            key={tab.key}
                            href={`/admin/courses${tab.key === 'all' ? '' : `?status=${tab.key}`}`}
                            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${statusFilter === tab.key
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-text-sub hover:text-primary hover:border-primary/30'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === tab.key
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {tab.count}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-b border-gray-100">
                    <form method="GET" action="/admin/courses" className="flex gap-3">
                        {statusFilter !== 'all' && <input type="hidden" name="status" value={statusFilter} />}
                        <div className="relative flex-1">
                            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="ค้นหาคอร์ส..."
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
                                <th scope="col" className="px-6 py-4">คอร์ส</th>
                                <th scope="col" className="px-6 py-4">ราคา</th>
                                <th scope="col" className="px-6 py-4">หมวดหมู่</th>
                                <th scope="col" className="px-6 py-4">สถานะ</th>
                                <th scope="col" className="px-6 py-4">นักเรียน</th>
                                <th scope="col" className="px-6 py-4">วันที่</th>
                                <th scope="col" className="px-6 py-4">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses && courses.length > 0 ? (
                                courses.map((course) => {
                                    const categoryNames = (course.course_categories as { categories: { name: string } | null }[])
                                        ?.map((cc) => cc.categories?.name)
                                        .filter(Boolean)
                                        .join(', ')
                                    const enrollCount = (course.enrollments as { id: string }[])?.length || 0
                                    const hasActiveSale = course.sale_price && (
                                        (!course.sale_start || new Date(course.sale_start) <= new Date()) &&
                                        (!course.sale_end || new Date(course.sale_end) >= new Date())
                                    )

                                    return (
                                        <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-main">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0">
                                                        {course.featured_image ? (
                                                            <img src={course.featured_image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                                        ) : (
                                                            <MaterialIcon name="menu_book" className="text-primary text-lg" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm truncate max-w-[200px]">{course.name}</p>
                                                        {course.is_featured && (
                                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">⭐ แนะนำ</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    {hasActiveSale ? (
                                                        <>
                                                            <span className="text-sm font-bold text-green-600">฿{Number(course.sale_price).toLocaleString()}</span>
                                                            <span className="text-xs text-text-sub line-through">฿{Number(course.price).toLocaleString()}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm font-bold">฿{Number(course.price).toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">{categoryNames || <span className="text-gray-400">-</span>}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={course.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <MaterialIcon name="group" className="text-sm text-gray-400" />
                                                    <span className="text-sm font-medium">{enrollCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-text-sub whitespace-nowrap">
                                                {course.created_at ? new Date(course.created_at).toLocaleDateString('th-TH', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                }) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/courses/${course.id}`}
                                                        className="p-1.5 rounded-lg text-text-sub hover:text-primary hover:bg-primary/10 transition-colors"
                                                        title="แก้ไข"
                                                    >
                                                        <MaterialIcon name="edit" className="text-lg" />
                                                    </Link>
                                                    <form action={toggleCourseStatus}>
                                                        <input type="hidden" name="course_id" value={course.id} />
                                                        <input type="hidden" name="current_status" value={course.status} />
                                                        <button
                                                            type="submit"
                                                            className={`p-1.5 rounded-lg transition-colors ${course.status === 'published'
                                                                ? 'text-green-600 hover:bg-green-50'
                                                                : 'text-gray-400 hover:bg-gray-100 hover:text-green-600'
                                                                }`}
                                                            title={course.status === 'published' ? 'ถอนเผยแพร่' : 'เผยแพร่'}
                                                        >
                                                            <MaterialIcon
                                                                name={course.status === 'published' ? 'visibility' : 'visibility_off'}
                                                                className="text-lg"
                                                            />
                                                        </button>
                                                    </form>
                                                    <form action={deleteCourse}>
                                                        <input type="hidden" name="course_id" value={course.id} />
                                                        <button
                                                            type="submit"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors"
                                                            title="ลบ"
                                                        >
                                                            <MaterialIcon name="delete" className="text-lg" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                <MaterialIcon name="menu_book" className="text-3xl text-gray-400" />
                                            </div>
                                            <p className="text-text-sub font-medium">
                                                {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ยังไม่มีคอร์สเรียน'}
                                            </p>
                                            <Link
                                                href="/admin/courses/new"
                                                className="text-sm text-primary font-bold hover:underline"
                                            >
                                                + สร้างคอร์สแรกของคุณ
                                            </Link>
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        published: 'bg-green-50 text-green-600',
        draft: 'bg-amber-50 text-amber-600',
        archived: 'bg-gray-100 text-gray-500',
    }
    const labels: Record<string, string> = {
        published: 'เผยแพร่',
        draft: 'ฉบับร่าง',
        archived: 'เก็บถาวร',
    }
    const icons: Record<string, string> = {
        published: 'check_circle',
        draft: 'edit_note',
        archived: 'archive',
    }
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${styles[status] || styles.draft}`}>
            <MaterialIcon name={icons[status] || 'circle'} className="text-xs" />
            {labels[status] || status}
        </span>
    )
}
