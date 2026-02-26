import Link from 'next/link'
import HeaderAuth from '@/app/components/HeaderAuth'
import MobileMenu from '@/app/components/MobileMenu'
import { createClient } from '@/utils/supabase/server'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function InstructorsArchivePage() {
    const supabase = await createClient()

    const { data: instructors } = await supabase
        .from('instructor_stats')
        .select('*')
        .order('sort_order', { ascending: true })

    const featured = instructors?.filter(i => i.is_featured) || []
    const all = instructors || []

    return (
        <div className="text-text-main">
            {/* Notebook Grid Background */}
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

                {/* ─── HERO ─── */}
                <section className="bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 right-10">
                            <MaterialIcon name="school" className="text-[14rem] text-white rotate-12" />
                        </div>
                        <div className="absolute bottom-5 left-20">
                            <MaterialIcon name="person" className="text-[8rem] text-white -rotate-6" />
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20 relative z-10 text-center text-white">
                        <span className="inline-block px-3 py-1 bg-white/15 text-white/90 text-xs font-bold tracking-wider uppercase rounded-full mb-4 backdrop-blur-sm">
                            OUR INSTRUCTORS
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-3 font-[var(--font-brand)]">ผู้สอนของเรา</h2>
                        <p className="text-white/80 text-sm lg:text-base max-w-lg mx-auto">
                            เรียนรู้จากผู้เชี่ยวชาญตัวจริง ทุกคอร์สออกแบบโดยมืออาชีพที่มีประสบการณ์จริง
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <MaterialIcon name="school" className="text-lg" />
                                <span className="font-bold">{all.length}</span>
                                <span className="text-white/80">ผู้สอน</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <MaterialIcon name="menu_book" className="text-lg" />
                                <span className="font-bold">{all.reduce((s, i) => s + (i.total_courses || 0), 0)}</span>
                                <span className="text-white/80">คอร์ส</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── MAIN CONTENT ─── */}
                <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex-1">

                    {/* Featured Instructors */}
                    {featured.length > 0 && (
                        <section className="mt-8 lg:mt-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <MaterialIcon name="star" className="text-amber-500 text-lg fill-1" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold">ผู้สอนแนะนำ</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {featured.map(instructor => (
                                    <InstructorCard key={instructor.id} instructor={instructor} featured />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Instructors */}
                    <section className="mt-8 lg:mt-12 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MaterialIcon name="group" className="text-primary text-lg" />
                            </div>
                            <h3 className="text-lg lg:text-xl font-bold">ผู้สอนทั้งหมด</h3>
                            <span className="text-xs text-text-sub bg-gray-100 px-2 py-0.5 rounded-full">{all.length} คน</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {all.map(instructor => (
                                <InstructorCard key={instructor.id} instructor={instructor} />
                            ))}
                        </div>

                        {all.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                                <MaterialIcon name="school" className="text-5xl text-gray-300 mb-3" />
                                <p className="text-text-sub">ยังไม่มีข้อมูลผู้สอน</p>
                            </div>
                        )}
                    </section>
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

function InstructorCard({ instructor, featured = false }: {
    instructor: {
        id: string; name: string; slug: string; highlight: string | null;
        image: string | null; cover_photo: string | null; is_featured: boolean;
        total_courses: number; total_reviews: number; average_rating: number;
    };
    featured?: boolean;
}) {
    return (
        <Link
            href={`/instructors/${instructor.slug}`}
            className={`bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group ${featured ? 'border-amber-200 shadow-md' : 'border-gray-200 shadow-sm'}`}
        >
            {/* Cover */}
            <div className={`relative ${featured ? 'h-32' : 'h-24'} overflow-hidden`}>
                {instructor.cover_photo ? (
                    <img src={instructor.cover_photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className={`w-full h-full ${featured ? 'bg-gradient-to-br from-primary via-primary/80 to-primary-dark' : 'bg-gradient-to-br from-primary/15 via-primary/5 to-transparent'}`} />
                )}
                {instructor.is_featured && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                        <MaterialIcon name="star" className="text-[10px] fill-1" /> แนะนำ
                    </div>
                )}
            </div>

            {/* Profile */}
            <div className="px-4 pb-4 -mt-7 relative">
                <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} rounded-xl border-[3px] border-white shadow-lg overflow-hidden bg-white mb-2`}>
                    {instructor.image ? (
                        <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                            <span className="text-white text-lg font-bold">{instructor.name[0]}</span>
                        </div>
                    )}
                </div>

                <h3 className={`font-bold text-text-main truncate group-hover:text-primary transition-colors ${featured ? 'text-base' : 'text-sm'}`}>
                    {instructor.name}
                </h3>
                {instructor.highlight && (
                    <p className="text-xs text-text-sub mt-0.5 line-clamp-2">{instructor.highlight}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-text-sub">
                    <span className="flex items-center gap-1">
                        <MaterialIcon name="menu_book" className="text-sm text-primary" />
                        <span className="font-bold text-text-main">{instructor.total_courses}</span> คอร์ส
                    </span>
                    <span className="flex items-center gap-1">
                        <MaterialIcon name="star" className="text-sm text-amber-500 fill-1" />
                        <span className="font-bold text-text-main">{Number(instructor.average_rating || 0).toFixed(1)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <MaterialIcon name="rate_review" className="text-sm text-gray-400" />
                        <span className="font-bold text-text-main">{instructor.total_reviews}</span>
                    </span>
                </div>
            </div>
        </Link>
    )
}
