import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateInstructor, deleteInstructor } from '../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <MaterialIcon name={icon} className="text-primary text-lg" />
                <h2 className="font-bold text-sm text-text-main">{title}</h2>
            </div>
            <div className="p-5 space-y-4">
                {children}
            </div>
        </div>
    )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-medium text-text-sub mb-1.5">
                {label} {required && <span className="text-secondary">*</span>}
            </label>
            {children}
        </div>
    )
}

export default async function EditInstructorPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createAdminClient()

    // Fetch instructor
    const { data: instructor } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single()

    if (!instructor) notFound()

    // Fetch stats from view
    const { data: stats } = await supabase
        .from('instructor_stats')
        .select('total_courses, total_reviews, average_rating')
        .eq('id', id)
        .single()

    // Fetch courses linked to this instructor
    const { data: courses } = await supabase
        .from('courses')
        .select('id, name, slug, status, price, average_rating, rating_count, total_sales')
        .eq('instructor_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/instructors" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-main">แก้ไขผู้สอน</h1>
                    <p className="text-text-sub text-sm">{instructor.name}</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats?.total_courses || 0}</div>
                    <div className="text-xs text-text-sub mt-1">คอร์ส</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-amber-500">{stats?.total_reviews || 0}</div>
                    <div className="text-xs text-text-sub mt-1">รีวิว</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{Number(stats?.average_rating || 0).toFixed(1)}</div>
                    <div className="text-xs text-text-sub mt-1">คะแนนเฉลี่ย</div>
                </div>
            </div>

            <form action={updateInstructor} className="space-y-6">
                <input type="hidden" name="instructor_id" value={instructor.id} />

                <FormSection title="ข้อมูลทั่วไป" icon="person">
                    <FormField label="ชื่อผู้สอน" required>
                        <input type="text" name="name" required defaultValue={instructor.name} className="form-input" />
                    </FormField>
                    <FormField label="Slug (URL)">
                        <input type="text" name="slug" defaultValue={instructor.slug} className="form-input" />
                    </FormField>
                    <FormField label="จุดเด่น / Highlight">
                        <input type="text" name="highlight" defaultValue={instructor.highlight || ''} className="form-input" />
                    </FormField>
                    <FormField label="ประวัติ / Bio">
                        <textarea name="bio" rows={5} defaultValue={instructor.bio || ''} className="form-input" />
                    </FormField>
                </FormSection>

                <FormSection title="รูปภาพ" icon="image">
                    <FormField label="รูปโปรไฟล์ (Profile Image URL)">
                        <input type="url" name="image" defaultValue={instructor.image || ''} className="form-input" />
                    </FormField>
                    {instructor.image && (
                        <div className="flex items-center gap-3">
                            <img src={instructor.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                            <span className="text-xs text-text-sub">ตัวอย่างรูปปัจจุบัน</span>
                        </div>
                    )}

                    <FormField label="รูปปก / Cover Photo URL">
                        <input type="url" name="cover_photo" defaultValue={instructor.cover_photo || ''} className="form-input" />
                    </FormField>
                    {instructor.cover_photo && (
                        <div>
                            <img src={instructor.cover_photo} alt="Cover preview" className="w-full h-24 rounded-xl object-cover border border-gray-200" />
                            <span className="text-xs text-text-sub mt-1">ตัวอย่างรูปปก</span>
                        </div>
                    )}
                </FormSection>

                <FormSection title="การแสดงผล" icon="visibility">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="is_featured" defaultChecked={instructor.is_featured} className="w-4 h-4 accent-primary rounded" />
                        <span className="text-sm text-text-main group-hover:text-primary transition-colors">⭐ ตั้งเป็นผู้สอนแนะนำ</span>
                    </label>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                    <Link href="/admin/instructors" className="px-6 py-3 text-text-sub text-sm font-medium hover:text-text-main transition-colors">
                        ยกเลิก
                    </Link>
                </div>
            </form>

            {/* Linked Courses */}
            <FormSection title={`คอร์สที่สอน (${courses?.length || 0})`} icon="menu_book">
                {courses && courses.length > 0 ? (
                    <div className="space-y-2">
                        {courses.map(course => (
                            <Link
                                key={course.id}
                                href={`/admin/courses/${course.id}`}
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-text-main truncate group-hover:text-primary transition-colors">{course.name}</h4>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <StatusBadge status={course.status} />
                                        <span className="text-[10px] text-text-sub">฿{Number(course.price || 0).toLocaleString()}</span>
                                        <span className="text-[10px] text-text-sub">⭐ {Number(course.average_rating || 0).toFixed(1)} ({course.rating_count} รีวิว)</span>
                                    </div>
                                </div>
                                <MaterialIcon name="chevron_right" className="text-gray-400 text-lg" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-sub text-center py-6">ยังไม่มีคอร์สที่เชื่อมโยง</p>
                )}
            </FormSection>

            {/* Delete */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                <h3 className="text-sm font-bold text-secondary mb-1">ลบผู้สอน</h3>
                <p className="text-xs text-text-sub mb-3">การลบผู้สอนจะไม่ลบคอร์สที่สอน แต่คอร์สจะไม่มีผู้สอนที่เชื่อมโยง</p>
                <form action={deleteInstructor}>
                    <input type="hidden" name="instructor_id" value={instructor.id} />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                        ลบผู้สอนนี้
                    </button>
                </form>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        published: 'bg-green-50 text-green-700',
        draft: 'bg-gray-100 text-gray-600',
        archived: 'bg-red-50 text-red-600',
    }
    const labels: Record<string, string> = {
        published: 'เผยแพร่',
        draft: 'ฉบับร่าง',
        archived: 'เก็บถาวร',
    }
    return (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles[status] || styles.draft}`}>
            {labels[status] || status}
        </span>
    )
}
