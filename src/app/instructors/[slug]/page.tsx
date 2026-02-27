import Link from 'next/link'
import { notFound } from 'next/navigation'
import HeaderAuth from '@/app/components/HeaderAuth'
import MobileMenu from '@/app/components/MobileMenu'
import { createAdminClient } from '@/utils/supabase/admin'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function InstructorDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const supabase = createAdminClient()

    // Fetch instructor with stats
    const { data: instructor } = await supabase
        .from('instructor_stats')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!instructor) notFound()

    // Fetch full bio from instructors table
    const { data: fullInstructor } = await supabase
        .from('instructors')
        .select('bio')
        .eq('id', instructor.id)
        .single()

    // Fetch courses by this instructor
    const { data: courses } = await supabase
        .from('courses')
        .select('id, name, slug, short_description, featured_image, price, sale_price, average_rating, rating_count, total_sales, difficulty_level, duration_hours, total_lessons, status')
        .eq('instructor_id', instructor.id)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })

    const publishedCourses = courses || []

    return (
        <div className="text-text-main">
            <div className="fixed inset-0 z-0 pointer-events-none grid-notebook"></div>

            <div className="relative z-10 min-h-screen flex flex-col pb-20 lg:pb-0">

                {/* ─── HEADER ─── */}
                <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
                        <MobileMenu links={[
                            { href: '/', label: 'หน้าแรก' },
                            { href: '#', label: 'คอร์สเรียน' },
                            { href: '/instructors', label: 'ผู้สอน', active: true },
                            { href: '#', label: 'เกี่ยวกับเรา' },
                        ]} />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm">
                                <span className="text-primary font-[var(--font-brand)] text-lg font-bold">L</span>
                            </div>
                            <Link href="/">
                                <h1 className="text-xl font-[var(--font-brand)] font-bold tracking-tight">LongTalkDoo</h1>
                            </Link>
                        </div>
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                            <Link href="/" className="text-white/70 hover:text-white transition-colors">หน้าแรก</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">คอร์สเรียน</Link>
                            <Link href="/instructors" className="text-white/90 hover:text-white transition-colors border-b-2 border-white pb-0.5">ผู้สอน</Link>
                            <Link href="#" className="text-white/70 hover:text-white transition-colors">เกี่ยวกับเรา</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                <MaterialIcon name="search" />
                            </button>
                            <div className="hidden lg:flex items-center gap-3">
                                <HeaderAuth />
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── COVER PHOTO (SkillLane-style) ─── */}
                <section className="relative">
                    <div className="h-48 lg:h-72 overflow-hidden">
                        {instructor.cover_photo ? (
                            <img
                                src={instructor.cover_photo}
                                alt={`${instructor.name} Cover`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-primary-dark relative">
                                <div className="absolute inset-0 opacity-5">
                                    <MaterialIcon name="school" className="absolute right-10 top-8 text-[12rem] text-white rotate-12" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        )}
                    </div>

                    {/* Breadcrumb */}
                    <div className="absolute top-4 left-4 lg:left-8">
                        <Link
                            href="/instructors"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs rounded-lg hover:bg-black/50 transition-colors"
                        >
                            <MaterialIcon name="arrow_back" className="text-sm" />
                            ผู้สอนทั้งหมด
                        </Link>
                    </div>
                </section>

                {/* ─── PROFILE INFO ─── */}
                <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 -mt-16 relative z-10">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5 lg:p-8">
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            {/* Avatar */}
                            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0 -mt-16 sm:-mt-20">
                                {instructor.image ? (
                                    <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">{instructor.name[0]}</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-text-main">{instructor.name}</h2>
                                        {instructor.highlight && (
                                            <p className="text-text-sub text-sm lg:text-base mt-1">{instructor.highlight}</p>
                                        )}
                                    </div>
                                    {instructor.is_featured && (
                                        <span className="flex-shrink-0 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                            <MaterialIcon name="star" className="text-xs fill-1" /> ผู้สอนแนะนำ
                                        </span>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2 bg-primary/5 px-4 py-2.5 rounded-xl">
                                        <MaterialIcon name="menu_book" className="text-primary text-lg" />
                                        <div>
                                            <div className="text-lg font-bold text-text-main leading-tight">{instructor.total_courses}</div>
                                            <div className="text-[10px] text-text-sub">คอร์ส</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-xl">
                                        <MaterialIcon name="star" className="text-amber-500 text-lg fill-1" />
                                        <div>
                                            <div className="text-lg font-bold text-text-main leading-tight">{Number(instructor.average_rating || 0).toFixed(1)}</div>
                                            <div className="text-[10px] text-text-sub">คะแนนเฉลี่ย</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-xl">
                                        <MaterialIcon name="rate_review" className="text-green-600 text-lg" />
                                        <div>
                                            <div className="text-lg font-bold text-text-main leading-tight">{instructor.total_reviews}</div>
                                            <div className="text-[10px] text-text-sub">รีวิว</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {fullInstructor?.bio && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                                    <MaterialIcon name="info" className="text-primary text-lg" />
                                    เกี่ยวกับผู้สอน
                                </h3>
                                <p className="text-sm text-text-sub leading-relaxed whitespace-pre-line">{fullInstructor.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── COURSES ─── */}
                <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 mt-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MaterialIcon name="play_circle" className="text-primary text-lg" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold">คอร์สของ {instructor.name}</h3>
                        <span className="text-xs text-text-sub bg-gray-100 px-2.5 py-0.5 rounded-full">{publishedCourses.length} คอร์ส</span>
                    </div>

                    {publishedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {publishedCourses.map(course => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group"
                                >
                                    {/* Course Image */}
                                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                                        {course.featured_image ? (
                                            <img
                                                src={course.featured_image}
                                                alt={course.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                <MaterialIcon name="menu_book" className="text-4xl text-primary/30" />
                                            </div>
                                        )}
                                        {course.sale_price && (
                                            <div className="absolute top-2 left-2 bg-secondary text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                                                ลดราคา
                                            </div>
                                        )}
                                        <DifficultyBadge level={course.difficulty_level} />
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm text-text-main line-clamp-2 group-hover:text-primary transition-colors leading-snug min-h-[2.5rem]">
                                            {course.name}
                                        </h4>
                                        {course.short_description && (
                                            <p className="text-xs text-text-sub mt-1 line-clamp-2">{course.short_description}</p>
                                        )}

                                        {/* Course Meta */}
                                        <div className="flex items-center gap-3 mt-3 text-[10px] text-text-sub">
                                            {course.total_lessons > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                    <MaterialIcon name="play_circle" className="text-[12px]" />
                                                    {course.total_lessons} บทเรียน
                                                </span>
                                            )}
                                            {course.duration_hours > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                    <MaterialIcon name="schedule" className="text-[12px]" />
                                                    {course.duration_hours} ชม.
                                                </span>
                                            )}
                                            {course.rating_count > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                    <MaterialIcon name="star" className="text-[12px] text-amber-500 fill-1" />
                                                    {Number(course.average_rating).toFixed(1)} ({course.rating_count})
                                                </span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                            {course.sale_price ? (
                                                <>
                                                    <span className="text-base font-bold text-secondary">฿{Number(course.sale_price).toLocaleString()}</span>
                                                    <span className="text-xs text-text-sub line-through">฿{Number(course.price).toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className="text-base font-bold text-text-main">
                                                    {Number(course.price) > 0 ? `฿${Number(course.price).toLocaleString()}` : 'ฟรี'}
                                                </span>
                                            )}
                                            {course.total_sales > 0 && (
                                                <span className="ml-auto text-[10px] text-text-sub flex items-center gap-0.5">
                                                    <MaterialIcon name="group" className="text-[12px]" />
                                                    {course.total_sales} คน
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                            <MaterialIcon name="menu_book" className="text-5xl text-gray-300 mb-3" />
                            <p className="text-text-sub">ยังไม่มีคอร์สที่เผยแพร่</p>
                        </div>
                    )}
                </div>

                {/* ─── FOOTER ─── */}
                <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center transform -rotate-3">
                                <span className="text-primary font-[var(--font-brand)] text-sm font-bold">L</span>
                            </div>
                            <span className="font-[var(--font-brand)] text-white font-bold text-lg">LongTalkDoo</span>
                        </div>
                        <p className="text-xs text-gray-500">© 2026 LongTalkDoo. All rights reserved.</p>
                    </div>
                </footer>

                {/* ─── MOBILE BOTTOM NAV ─── */}
                <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 lg:hidden">
                    <div className="flex items-center justify-around h-16">
                        <Link href="/" className="flex flex-col items-center gap-0.5 text-text-sub">
                            <MaterialIcon name="home" className="text-xl" />
                            <span className="text-[10px]">หน้าแรก</span>
                        </Link>
                        <Link href="#" className="flex flex-col items-center gap-0.5 text-text-sub">
                            <MaterialIcon name="menu_book" className="text-xl" />
                            <span className="text-[10px]">คอร์สเรียน</span>
                        </Link>
                        <Link href="/instructors" className="flex flex-col items-center gap-0.5 text-primary">
                            <MaterialIcon name="school" className="text-xl fill-1" />
                            <span className="text-[10px] font-bold">ผู้สอน</span>
                        </Link>
                        <Link href="/profile" className="flex flex-col items-center gap-0.5 text-text-sub">
                            <MaterialIcon name="person" className="text-xl" />
                            <span className="text-[10px]">โปรไฟล์</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}

function DifficultyBadge({ level }: { level: string }) {
    const styles: Record<string, string> = {
        beginner: 'bg-green-500',
        intermediate: 'bg-amber-500',
        advanced: 'bg-red-500',
        all_levels: 'bg-primary',
    }
    const labels: Record<string, string> = {
        beginner: 'เริ่มต้น',
        intermediate: 'ปานกลาง',
        advanced: 'ขั้นสูง',
        all_levels: 'ทุกระดับ',
    }
    if (!level) return null
    return (
        <span className={`absolute top-2 right-2 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${styles[level] || styles.all_levels}`}>
            {labels[level] || level}
        </span>
    )
}
