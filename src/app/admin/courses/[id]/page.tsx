import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateCourse, deleteCourse } from '../actions'

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

    const currentCategoryId = (course.course_categories as { category_id: string }[])?.[0]?.category_id || ''
    const currentTags = (course.course_tag_map as { course_tags: { name: string } | null }[])
        ?.map(t => t.course_tags?.name)
        .filter(Boolean)
        .join(', ') || ''

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

            <form action={updateCourse}>
                <input type="hidden" name="course_id" value={course.id} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* General Info */}
                        <FormSection title="ข้อมูลทั่วไป" icon="info">
                            <FormField label="ชื่อคอร์ส" required>
                                <input type="text" name="name" required defaultValue={course.name} className="form-input" />
                            </FormField>
                            <FormField label="Slug (URL)">
                                <input type="text" name="slug" defaultValue={course.slug} className="form-input font-mono text-xs" />
                            </FormField>
                            <FormField label="รายละเอียด">
                                <textarea name="description" rows={5} defaultValue={course.description || ''} className="form-input resize-y" />
                            </FormField>
                        </FormSection>

                        {/* Pricing */}
                        <FormSection title="ราคา" icon="payments">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="ราคาปกติ (฿)" required>
                                    <input type="number" name="price" required step="0.01" min="0" defaultValue={course.price || 0} className="form-input" />
                                </FormField>
                                <FormField label="ราคาลด (฿)">
                                    <input type="number" name="sale_price" step="0.01" min="0" defaultValue={course.sale_price || ''} className="form-input" />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="เริ่มลดราคา">
                                    <input type="datetime-local" name="sale_start" defaultValue={course.sale_start ? new Date(course.sale_start).toISOString().slice(0, 16) : ''} className="form-input" />
                                </FormField>
                                <FormField label="หมดเขตลดราคา">
                                    <input type="datetime-local" name="sale_end" defaultValue={course.sale_end ? new Date(course.sale_end).toISOString().slice(0, 16) : ''} className="form-input" />
                                </FormField>
                            </div>
                        </FormSection>

                        {/* Access & Duration */}
                        <FormSection title="ระยะเวลาเข้าถึง" icon="schedule">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="ระยะเวลา">
                                    <input type="number" name="access_duration_value" min="0" defaultValue={course.access_duration_value || 0} className="form-input" />
                                </FormField>
                                <FormField label="หน่วย">
                                    <select name="access_duration_unit" defaultValue={course.access_duration_unit || 'lifetime'} className="form-input">
                                        <option value="lifetime">ตลอดชีพ (Lifetime)</option>
                                        <option value="minute">นาที</option>
                                        <option value="hour">ชั่วโมง</option>
                                        <option value="day">วัน</option>
                                        <option value="week">สัปดาห์</option>
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="บล็อกเนื้อหา">
                                <select name="block_content" defaultValue={course.block_content || 'on_expiry'} className="form-input">
                                    <option value="on_expiry">บล็อกเมื่อหมดเวลาเข้าถึง</option>
                                    <option value="on_completion">บล็อกเมื่อเรียนจบแล้ว</option>
                                </select>
                            </FormField>
                        </FormSection>

                        {/* Repurchase */}
                        <FormSection title="ซื้อซ้ำ" icon="replay">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="allow_repurchase" id="allow_repurchase" defaultChecked={course.allow_repurchase} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="allow_repurchase" className="text-sm text-text-sub">อนุญาตให้ซื้อซ้ำ</label>
                            </div>
                            <FormField label="เมื่อซื้อซ้ำ">
                                <select name="repurchase_action" defaultValue={course.repurchase_action || 'reset_progress'} className="form-input">
                                    <option value="reset_progress">ล้างความคืบหน้า — ผลการเรียนจะถูกลบ</option>
                                    <option value="keep_progress">เก็บความคืบหน้า — ผลการเรียนยังอยู่</option>
                                    <option value="open_popup">แสดง Popup — ให้ผู้เรียนเลือกเอง</option>
                                </select>
                            </FormField>
                        </FormSection>

                        {/* Course Settings */}
                        <FormSection title="ตั้งค่าคอร์ส" icon="tune">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="ระดับ">
                                    <select name="difficulty_level" defaultValue={course.difficulty_level || 'beginner'} className="form-input">
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </FormField>
                                <FormField label="จำนวนเรียนซ้ำ (Re-take)">
                                    <input type="number" name="retake_count" min="0" defaultValue={course.retake_count || 0} className="form-input" />
                                </FormField>
                                <FormField label="จำนวนผู้เรียนสูงสุด">
                                    <input type="number" name="max_students" min="0" defaultValue={course.max_students || 0} className="form-input" />
                                </FormField>
                            </div>
                            <FormField label="จำนวนผู้เรียน (แสดงอย่างเดียว)">
                                <input type="number" name="fake_students_enrolled" min="0" defaultValue={course.fake_students_enrolled || 0} className="form-input" />
                                <p className="text-[10px] text-text-sub mt-1">แสดงเป็นตัวเลข ไม่ถูกนำไปคำนวณ</p>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="show_finish_button" id="show_finish_button" defaultChecked={course.show_finish_button ?? true} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="show_finish_button" className="text-sm text-text-sub">แสดงปุ่ม &quot;เรียนจบ&quot; ก่อนผ่านการประเมิน</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="no_enroll_requirement" id="no_enroll_requirement" defaultChecked={course.no_enroll_requirement} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="no_enroll_requirement" className="text-sm text-text-sub">ไม่ต้องสมัครสมาชิก — ดูเนื้อหาและทำแบบทดสอบได้เลย</label>
                            </div>
                        </FormSection>

                        {/* Evaluation */}
                        <FormSection title="การประเมินผล" icon="assessment">
                            <FormField label="วิธีประเมิน">
                                <select name="evaluation_method" defaultValue={course.evaluation_method || 'lessons'} className="form-input">
                                    <option value="lessons">ประเมินจากบทเรียน (Evaluate via lessons)</option>
                                    <option value="final_quiz">ประเมินจากแบบทดสอบปลายภาค (Final quiz)</option>
                                    <option value="passed_quizzes">ประเมินจากแบบทดสอบที่ผ่าน (Passed quizzes)</option>
                                    <option value="questions">ประเมินจากคำถาม (Questions)</option>
                                    <option value="mark">ประเมินจากเครื่องหมาย (Mark)</option>
                                </select>
                            </FormField>
                            <FormField label="คะแนนผ่าน (%)">
                                <input type="number" name="passing_grade" min="0" max="100" step="0.01" defaultValue={course.passing_grade || 0} className="form-input" />
                            </FormField>
                        </FormSection>

                        {/* Course Features */}
                        <FormSection title="สิ่งที่ได้รับ" icon="checklist">
                            <FormField label="รายการ (บรรทัดละข้อ)">
                                <textarea name="course_features" rows={5} defaultValue={course.course_features || ''} placeholder={"วิดีโอ 10+ ชั่วโมง\nแบบฝึกหัดท้ายบท\nใบ Certificate\nเข้าถึงตลอดชีพ"} className="form-input resize-y" />
                                <p className="text-[10px] text-text-sub mt-1">แต่ละบรรทัดจะแสดงเป็น bullet</p>
                            </FormField>
                        </FormSection>

                        {/* Prerequisites & What You'll Learn */}
                        <FormSection title="ข้อกำหนด & สิ่งที่ได้เรียน" icon="lightbulb">
                            <FormField label="ข้อกำหนดเบื้องต้น (Prerequisites)">
                                <textarea name="prerequisites" rows={3} defaultValue={course.prerequisites || ''} placeholder={"- มีพื้นฐาน HTML/CSS\n- เข้าใจ JavaScript เบื้องต้น"} className="form-input resize-y" />
                            </FormField>
                            <FormField label="สิ่งที่จะได้เรียนรู้ (What you'll learn)">
                                <textarea name="what_you_learn" rows={3} defaultValue={course.what_you_learn || ''} placeholder={"- เข้าใจหลักการ Prompt Engineering\n- ใช้ AI ช่วยเขียนโค้ด"} className="form-input resize-y" />
                            </FormField>
                        </FormSection>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        <FormSection title="เผยแพร่" icon="publish">
                            <FormField label="สถานะ">
                                <select name="status" defaultValue={course.status} className="form-input">
                                    <option value="draft">ฉบับร่าง</option>
                                    <option value="published">เผยแพร่</option>
                                    <option value="archived">เก็บถาวร</option>
                                </select>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={course.is_featured} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="is_featured" className="text-sm text-text-sub">⭐ คอร์สแนะนำ</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="enable_reviews" id="enable_reviews" defaultChecked={course.enable_reviews ?? true} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="enable_reviews" className="text-sm text-text-sub">เปิดให้รีวิว</label>
                            </div>
                            {course.published_at && (
                                <p className="text-xs text-text-sub mt-2">
                                    เผยแพร่เมื่อ: {new Date(course.published_at).toLocaleDateString('th-TH', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </FormSection>

                        <FormSection title="รูปภาพหลัก" icon="image">
                            {course.featured_image && (
                                <div className="mb-3">
                                    <img src={course.featured_image} alt="" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                                </div>
                            )}
                            <FormField label="URL รูปภาพ">
                                <input type="url" name="featured_image" defaultValue={course.featured_image || ''} className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="วิดีโอแนะนำ" icon="play_circle">
                            <FormField label="Embed URL (iframe)">
                                <input type="url" name="media_intro" defaultValue={course.media_intro || ''} placeholder="https://youtube.com/embed/..." className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="ผู้สอน" icon="school">
                            <FormField label="เลือกผู้สอน">
                                <select name="instructor_id" defaultValue={course.instructor_id || ''} className="form-input">
                                    <option value="">— ไม่ระบุ —</option>
                                    {instructors?.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                            </FormField>
                        </FormSection>

                        <FormSection title="ใบรับรอง" icon="workspace_premium">
                            <div className="flex items-center gap-3 mb-3">
                                <input type="checkbox" name="has_certificate" id="has_certificate" defaultChecked={course.has_certificate} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="has_certificate" className="text-sm text-text-sub">🎓 มีวุฒิบัตร</label>
                            </div>
                            <FormField label="Template URL">
                                <input type="url" name="certificate_template" defaultValue={course.certificate_template || ''} placeholder="https://..." className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="หมวดหมู่" icon="category">
                            <FormField label="เลือกหมวดหมู่">
                                <select name="category_id" defaultValue={currentCategoryId} className="form-input">
                                    <option value="">— ไม่ระบุ —</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.parent_id ? '— ' : ''}{cat.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </FormSection>

                        <FormSection title="แท็ก" icon="label">
                            <FormField label="แท็ก (คั่นด้วย ,)">
                                <input type="text" name="tags" defaultValue={currentTags} className="form-input" />
                            </FormField>
                        </FormSection>

                        <div className="flex flex-col gap-3">
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                                <MaterialIcon name="save" className="text-lg" />
                                อัปเดตคอร์ส
                            </button>
                            <Link href="/admin/courses" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-text-sub px-5 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
                                ยกเลิก
                            </Link>
                        </div>
                    </div>
                </div>
            </form>

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

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <MaterialIcon name={icon} className="text-primary text-lg" />
                <h3 className="font-bold text-sm text-text-main">{title}</h3>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-medium text-text-sub mb-1.5">
                {label}{required && <span className="text-secondary ml-0.5">*</span>}
            </label>
            {children}
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
