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

    const { count: enrollmentCount } = await supabase
        .from('enrollments')
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

            <form action={updateCourse}>
                <input type="hidden" name="course_id" value={course.id} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <FormSection title="ข้อมูลทั่วไป" icon="info">
                            <FormField label="ชื่อคอร์ส / สินค้า" required>
                                <input type="text" name="name" required defaultValue={course.name} className="form-input" />
                            </FormField>
                            <FormField label="Slug (URL)">
                                <input type="text" name="slug" defaultValue={course.slug} className="form-input font-mono text-xs" />
                            </FormField>
                            <FormField label="คำอธิบายสั้น">
                                <input type="text" name="short_description" defaultValue={course.short_description || ''} className="form-input" />
                            </FormField>
                            <FormField label="รายละเอียด">
                                <textarea name="description" rows={5} defaultValue={course.description || ''} className="form-input resize-y" />
                            </FormField>
                        </FormSection>

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

                        <FormSection title="คลังสินค้า" icon="inventory_2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="SKU (รหัสสินค้า)">
                                    <input type="text" name="sku" defaultValue={course.sku || ''} className="form-input font-mono" />
                                </FormField>
                                <FormField label="จำนวนในคลัง">
                                    <input type="number" name="stock_quantity" min="0" defaultValue={course.stock_quantity || 0} className="form-input" />
                                </FormField>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="manage_stock" id="manage_stock" defaultChecked={course.manage_stock} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="manage_stock" className="text-sm text-text-sub">จัดการสต็อก</label>
                            </div>
                        </FormSection>

                        <FormSection title="รายละเอียดคอร์ส" icon="school">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="ระดับ">
                                    <select name="difficulty_level" defaultValue={course.difficulty_level || 'beginner'} className="form-input">
                                        <option value="beginner">เริ่มต้น</option>
                                        <option value="intermediate">กลาง</option>
                                        <option value="advanced">สูง</option>
                                        <option value="all_levels">ทุกระดับ</option>
                                    </select>
                                </FormField>
                                <FormField label="ชั่วโมงเรียน">
                                    <input type="number" name="duration_hours" step="0.5" min="0" defaultValue={course.duration_hours || ''} className="form-input" />
                                </FormField>
                                <FormField label="จำนวนบทเรียน">
                                    <input type="number" name="total_lessons" min="0" defaultValue={course.total_lessons || 0} className="form-input" />
                                </FormField>
                            </div>
                        </FormSection>
                    </div>

                    <div className="space-y-6">
                        <FormSection title="เผยแพร่" icon="publish">
                            <FormField label="สถานะ">
                                <select name="status" defaultValue={course.status} className="form-input">
                                    <option value="draft">ฉบับร่าง</option>
                                    <option value="published">เผยแพร่</option>
                                    <option value="archived">เก็บถาวร</option>
                                </select>
                            </FormField>
                            <FormField label="การมองเห็น">
                                <select name="visibility" defaultValue={course.visibility || 'visible'} className="form-input">
                                    <option value="visible">แสดง</option>
                                    <option value="hidden">ซ่อน</option>
                                    <option value="catalog">แค็ตตาล็อกเท่านั้น</option>
                                    <option value="search">ค้นหาเท่านั้น</option>
                                </select>
                            </FormField>
                            <FormField label="ประเภทสินค้า">
                                <select name="product_type" defaultValue={course.product_type} className="form-input">
                                    <option value="simple">สินค้าเดี่ยว</option>
                                    <option value="variable">มีตัวเลือก</option>
                                    <option value="bundle">ชุดรวม</option>
                                </select>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={course.is_featured} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="is_featured" className="text-sm text-text-sub">⭐ คอร์สแนะนำ</label>
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
                            <FormField label="แท็ก (คั่นด้วยเครื่องหมาย ,)">
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
