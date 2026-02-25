import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { createSection, deleteSection, createLesson, deleteLesson } from '../../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

const lessonTypeIcons: Record<string, string> = {
    video: 'play_circle',
    text: 'article',
    quiz: 'quiz',
    assignment: 'assignment',
    download: 'download',
}

const lessonTypeLabels: Record<string, string> = {
    video: 'วิดีโอ',
    text: 'บทความ',
    quiz: 'แบบทดสอบ',
    assignment: 'แบบฝึกหัด',
    download: 'ดาวน์โหลด',
}

export default async function CurriculumPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: course } = await supabase
        .from('courses')
        .select('id, name, slug')
        .eq('id', id)
        .single()

    if (!course) notFound()

    const { data: sections } = await supabase
        .from('course_sections')
        .select(`
            *,
            course_lessons (*)
        `)
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    // Sort lessons within each section
    const sortedSections = sections?.map(section => ({
        ...section,
        course_lessons: ((section.course_lessons as Record<string, unknown>[]) || []).sort(
            (a, b) => (a.sort_order as number) - (b.sort_order as number)
        ),
    })) || []

    const totalLessons = sortedSections.reduce(
        (sum, s) => sum + (s.course_lessons as unknown[]).length, 0
    )
    const totalDuration = sortedSections.reduce(
        (sum, s) => sum + (s.course_lessons as { duration_minutes: number }[]).reduce(
            (lSum, l) => lSum + (l.duration_minutes || 0), 0
        ), 0
    )

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/courses/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-main">เนื้อหาคอร์ส</h1>
                    <p className="text-text-sub text-sm">{course.name}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-sub">
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <MaterialIcon name="folder" className="text-sm text-primary" />
                        {sortedSections.length} บท
                    </span>
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <MaterialIcon name="play_circle" className="text-sm text-primary" />
                        {totalLessons} บทเรียน
                    </span>
                    <span className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <MaterialIcon name="schedule" className="text-sm text-primary" />
                        {Math.floor(totalDuration / 60)}ชม. {totalDuration % 60}น.
                    </span>
                </div>
            </div>

            {/* Tab nav */}
            <div className="flex border-b border-gray-200">
                <Link href={`/admin/courses/${id}`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors">
                    ข้อมูลคอร์ส
                </Link>
                <Link href={`/admin/courses/${id}/curriculum`} className="px-5 py-3 text-sm font-bold text-primary border-b-2 border-primary">
                    เนื้อหา
                </Link>
                <Link href={`/admin/courses/${id}/quizzes`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors">
                    แบบทดสอบ
                </Link>
            </div>

            {/* Sections */}
            <div className="space-y-4">
                {sortedSections.map((section, sectionIndex) => {
                    const lessons = section.course_lessons as {
                        id: string; title: string; lesson_type: string;
                        duration_minutes: number; is_preview: boolean; content_url: string | null;
                    }[]

                    return (
                        <div key={section.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Section Header */}
                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                        {sectionIndex + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-text-main">{section.title}</h3>
                                        {section.description && (
                                            <p className="text-xs text-text-sub mt-0.5">{section.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-text-sub bg-white px-2 py-1 rounded-lg border border-gray-100">
                                        {lessons.length} บทเรียน
                                    </span>
                                    <form action={deleteSection}>
                                        <input type="hidden" name="section_id" value={section.id} />
                                        <input type="hidden" name="course_id" value={id} />
                                        <button type="submit" className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors" title="ลบบท">
                                            <MaterialIcon name="delete" className="text-lg" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="divide-y divide-gray-50">
                                {lessons.map((lesson, lessonIndex) => (
                                    <div key={lesson.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors group">
                                        <span className="text-xs text-text-sub w-6 text-right font-mono">
                                            {sectionIndex + 1}.{lessonIndex + 1}
                                        </span>
                                        <MaterialIcon
                                            name={lessonTypeIcons[lesson.lesson_type] || 'circle'}
                                            className={`text-lg ${lesson.lesson_type === 'video' ? 'text-blue-500' : lesson.lesson_type === 'quiz' ? 'text-amber-500' : 'text-gray-400'}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-main truncate">{lesson.title}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-text-sub">
                                                    {lessonTypeLabels[lesson.lesson_type] || lesson.lesson_type}
                                                </span>
                                                {lesson.is_preview && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">ตัวอย่างฟรี</span>
                                                )}
                                            </div>
                                        </div>
                                        {lesson.duration_minutes > 0 && (
                                            <span className="text-xs text-text-sub font-mono">
                                                {Math.floor(lesson.duration_minutes / 60) > 0 ? `${Math.floor(lesson.duration_minutes / 60)}:` : ''}
                                                {String(lesson.duration_minutes % 60).padStart(2, '0')} น.
                                            </span>
                                        )}
                                        <form action={deleteLesson} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <input type="hidden" name="lesson_id" value={lesson.id} />
                                            <input type="hidden" name="course_id" value={id} />
                                            <button type="submit" className="p-1 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors" title="ลบ">
                                                <MaterialIcon name="close" className="text-sm" />
                                            </button>
                                        </form>
                                    </div>
                                ))}

                                {lessons.length === 0 && (
                                    <div className="px-5 py-6 text-center text-sm text-text-sub">
                                        ยังไม่มีบทเรียนในบทนี้
                                    </div>
                                )}
                            </div>

                            {/* Add Lesson Form */}
                            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                                <form action={createLesson} className="flex items-center gap-2">
                                    <input type="hidden" name="section_id" value={section.id} />
                                    <input type="hidden" name="course_id" value={id} />
                                    <MaterialIcon name="add" className="text-primary text-lg" />
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        placeholder="ชื่อบทเรียนใหม่..."
                                        className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
                                    />
                                    <select name="lesson_type" className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-text-sub">
                                        <option value="video">🎬 วิดีโอ</option>
                                        <option value="text">📄 บทความ</option>
                                        <option value="assignment">📝 แบบฝึกหัด</option>
                                        <option value="download">📥 ดาวน์โหลด</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="duration_minutes"
                                        placeholder="นาที"
                                        min="0"
                                        className="w-16 text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-center"
                                    />
                                    <label className="flex items-center gap-1 text-xs text-text-sub">
                                        <input type="checkbox" name="is_preview" className="w-3 h-3 accent-primary" />
                                        ฟรี
                                    </label>
                                    <button type="submit" className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors">
                                        เพิ่ม
                                    </button>
                                </form>
                            </div>
                        </div>
                    )
                })}

                {sortedSections.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <MaterialIcon name="folder_open" className="text-3xl text-gray-400" />
                        </div>
                        <p className="text-text-sub font-medium mb-1">ยังไม่มีเนื้อหา</p>
                        <p className="text-xs text-text-sub">เริ่มสร้างบทแรกของคอร์สด้านล่าง</p>
                    </div>
                )}
            </div>

            {/* Add Section Form */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
                <form action={createSection} className="p-5">
                    <input type="hidden" name="course_id" value={id} />
                    <h4 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
                        <MaterialIcon name="add_circle" className="text-primary text-lg" />
                        เพิ่มบทใหม่
                    </h4>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="เช่น บทที่ 1: แนะนำ Prompt Engineering"
                            className="flex-1 form-input"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="คำอธิบายสั้น (ไม่บังคับ)"
                            className="flex-1 form-input"
                        />
                        <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors whitespace-nowrap">
                            + เพิ่มบท
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
