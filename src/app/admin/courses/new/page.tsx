import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { createCourse } from '../actions'
import CourseForm from '../CourseForm'

export default async function NewCoursePage() {
    const supabase = createAdminClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .order('sort_order', { ascending: true })

    const { data: instructors } = await supabase
        .from('instructors')
        .select('id, name')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/courses" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">เพิ่มคอร์สใหม่</h1>
                    <p className="text-text-sub text-sm">สร้างคอร์สเรียนใหม่</p>
                </div>
            </div>

            <CourseForm
                categories={categories || []}
                instructors={instructors || []}
                action={createCourse}
            />
        </div>
    )
}
