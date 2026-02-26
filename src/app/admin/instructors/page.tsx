import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { deleteInstructor, toggleInstructorFeatured } from './actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminInstructorsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; featured?: string }>
}) {
    const params = await searchParams
    const searchQuery = params.search || ''
    const featuredFilter = params.featured || 'all'

    const supabase = createAdminClient()

    // Fetch instructors with stats from the view
    let query = supabase
        .from('instructor_stats')
        .select('*')
        .order('sort_order', { ascending: true })

    if (featuredFilter === 'featured') {
        query = query.eq('is_featured', true)
    }

    if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,highlight.ilike.%${searchQuery}%`)
    }

    const { data: instructors, error } = await query

    const { count: totalCount } = await supabase.from('instructors').select('*', { count: 'exact', head: true })
    const { count: featuredCount } = await supabase.from('instructors').select('*', { count: 'exact', head: true }).eq('is_featured', true)

    const tabs = [
        { key: 'all', label: 'ทั้งหมด', count: totalCount || 0 },
        { key: 'featured', label: 'แนะนำ', count: featuredCount || 0 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-text-main">ผู้สอน</h1>
                    <p className="text-text-sub text-sm">จัดการข้อมูลผู้สอนทั้งหมด</p>
                </div>
                <Link
                    href="/admin/instructors/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <MaterialIcon name="add" className="text-lg" />
                    เพิ่มผู้สอนใหม่
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    {tabs.map(tab => (
                        <Link
                            key={tab.key}
                            href={`/admin/instructors${tab.key === 'all' ? '' : `?featured=${tab.key}`}`}
                            className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${featuredFilter === tab.key
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-text-sub hover:text-primary hover:border-primary/30'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${featuredFilter === tab.key
                                ? 'bg-primary/10 text-primary'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {tab.count}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                    <form method="GET" action="/admin/instructors" className="flex gap-3">
                        {featuredFilter !== 'all' && <input type="hidden" name="featured" value={featuredFilter} />}
                        <div className="relative flex-1">
                            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="ค้นหาชื่อผู้สอน, จุดเด่น..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-text-sub hover:bg-gray-200 transition-colors">
                            ค้นหา
                        </button>
                    </form>
                </div>

                {/* Instructor Cards Grid */}
                <div className="p-4">
                    {instructors && instructors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {instructors.map((instructor) => (
                                <div key={instructor.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                                    {/* Cover Photo */}
                                    <div className="relative h-28 bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden">
                                        {instructor.cover_photo ? (
                                            <img src={instructor.cover_photo} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                                        )}
                                        {instructor.is_featured && (
                                            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                                                ⭐ แนะนำ
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile */}
                                    <div className="px-4 pb-4 -mt-8 relative">
                                        <div className="w-16 h-16 rounded-xl border-4 border-white shadow-md overflow-hidden bg-white mb-3">
                                            {instructor.image ? (
                                                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                                    <span className="text-white text-xl font-bold">{instructor.name[0]}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">{instructor.name}</h3>
                                        {instructor.highlight && (
                                            <p className="text-xs text-text-sub mt-0.5 line-clamp-1">{instructor.highlight}</p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mt-3 text-xs text-text-sub">
                                            <span className="flex items-center gap-1">
                                                <MaterialIcon name="menu_book" className="text-sm text-primary" />
                                                <span className="font-bold text-text-main">{instructor.total_courses}</span> คอร์ส
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MaterialIcon name="reviews" className="text-sm text-amber-500" />
                                                <span className="font-bold text-text-main">{instructor.total_reviews}</span> รีวิว
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MaterialIcon name="star" className="text-sm text-amber-500 fill-1" />
                                                <span className="font-bold text-text-main">{Number(instructor.average_rating).toFixed(1)}</span>
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                                            <Link
                                                href={`/admin/instructors/${instructor.id}`}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
                                            >
                                                <MaterialIcon name="edit" className="text-sm" />
                                                แก้ไข
                                            </Link>
                                            <form action={toggleInstructorFeatured}>
                                                <input type="hidden" name="instructor_id" value={instructor.id} />
                                                <input type="hidden" name="current_featured" value={String(instructor.is_featured)} />
                                                <button
                                                    type="submit"
                                                    className={`p-2 rounded-lg transition-colors ${instructor.is_featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                                                    title={instructor.is_featured ? 'ยกเลิกแนะนำ' : 'ตั้งเป็นแนะนำ'}
                                                >
                                                    <MaterialIcon name="star" className={`text-lg ${instructor.is_featured ? 'fill-1' : ''}`} />
                                                </button>
                                            </form>
                                            <form action={deleteInstructor}>
                                                <input type="hidden" name="instructor_id" value={instructor.id} />
                                                <button
                                                    type="submit"
                                                    className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors"
                                                    title="ลบ"
                                                >
                                                    <MaterialIcon name="delete" className="text-lg" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <MaterialIcon name="person" className="text-3xl text-gray-400" />
                                </div>
                                <p className="text-text-sub font-medium">
                                    {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ยังไม่มีผู้สอน'}
                                </p>
                                <Link
                                    href="/admin/instructors/new"
                                    className="text-sm text-primary font-bold hover:underline"
                                >
                                    + เพิ่มผู้สอนคนแรก
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
