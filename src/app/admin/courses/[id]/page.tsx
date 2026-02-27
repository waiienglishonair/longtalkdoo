import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateCourse, deleteCourse, createSection, deleteSection, createLesson, deleteLesson, createQuiz, deleteQuiz } from '../actions'
import CourseForm from '../CourseForm'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function EditCoursePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            course_categories ( category_id ),
            course_tag_map ( tag_id, course_tags ( name ) )
        `)
        .eq('id', id)
        .single()

    if (error || !course) notFound()

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .order('sort_order', { ascending: true })

    const { data: instructors } = await supabase
        .from('instructors')
        .select('id, name')
        .order('name', { ascending: true })

    const { data: allTags } = await supabase
        .from('course_tags')
        .select('id, name, slug')
        .order('name', { ascending: true })

    const { count: enrollmentCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id)

    const { count: sectionCount } = await supabase
        .from('course_sections')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id)

    const { count: quizCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', id)

    const { data: sectionsData } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    const currentCategoryIds = (course.course_categories as { category_id: string }[])?.map(cc => cc.category_id) || []
    const currentTagIds = (course.course_tag_map as { tag_id: string }[])?.map(t => t.tag_id) || []

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/courses" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                        <MaterialIcon name="arrow_back" className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">แก้ไขคอร์ส</h1>
                        <p className="text-text-sub text-sm">{course.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-text-sub bg-gray-100 px-3 py-1.5 rounded-lg">
                        <MaterialIcon name="group" className="text-sm" />
                        {enrollmentCount || 0} นักเรียน
                    </div>
                    <StatusBadge status={course.status} />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <Link href={`/admin/courses/${id}`} className="px-5 py-3 text-sm font-bold text-primary border-b-2 border-primary">
                    ข้อมูลคอร์ส
                </Link>
                <Link href={`/admin/courses/${id}/curriculum`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors flex items-center gap-1.5">
                    เนื้อหา
                    <span className="text-[10px] bg-gray-100 text-text-sub px-1.5 py-0.5 rounded-full">{sectionCount || 0}</span>
                </Link>
                <Link href={`/admin/courses/${id}/quizzes`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors flex items-center gap-1.5">
                    แบบทดสอบ
                    <span className="text-[10px] bg-gray-100 text-text-sub px-1.5 py-0.5 rounded-full">{quizCount || 0}</span>
                </Link>
            </div>

            <CourseForm
                course={course}
                categories={categories || []}
                tags={allTags || []}
                instructors={instructors || []}
                sections={sectionsData || []}
                lessons={lessonsData || []}
                quizzes={quizzesData || []}
                currentCategoryIds={currentCategoryIds}
                currentTagIds={currentTagIds}
                action={updateCourse}
                createSection={createSection}
                deleteSection={deleteSection}
                createLesson={createLesson}
                deleteLesson={deleteLesson}
                createQuiz={createQuiz}
                deleteQuiz={deleteQuiz}
            />

            <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                <h3 className="font-bold text-sm text-secondary mb-2 flex items-center gap-2">
                    <MaterialIcon name="warning" className="text-lg" />
                    Danger Zone
                </h3>
                <p className="text-xs text-red-700 mb-4">การลบจะไม่สามารถกู้คืนได้ นักเรียนที่ลงทะเบียนจะสูญเสียการเข้าถึง</p>
                <form action={deleteCourse}>
                    <input type="hidden" name="course_id" value={course.id} />
                    <button type="submit" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                        <MaterialIcon name="delete_forever" className="text-lg" />
                        ลบคอร์สนี้ถาวร
                    </button>
                </form>
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
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${styles[status] || styles.draft}`}>
            {labels[status] || status}
        </span>
    )
}
