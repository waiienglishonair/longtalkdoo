import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { createCourse } from '../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function NewCoursePage() {
    const supabase = createAdminClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .order('sort_order', { ascending: true })

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/courses"
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub"
                >
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">เพิ่มคอร์สใหม่</h1>
                    <p className="text-text-sub text-sm">สร้างคอร์สเรียน / สินค้าใหม่</p>
                </div>
            </div>

            <form action={createCourse}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <FormSection title="ข้อมูลทั่วไป" icon="info">
                            <FormField label="ชื่อคอร์ส / สินค้า" required>
                                <input type="text" name="name" required placeholder="เช่น ภาษาอังกฤษธุรกิจ Pro" className="form-input" />
                            </FormField>
                            <FormField label="Slug (URL)">
                                <input type="text" name="slug" placeholder="auto-generated-from-name" className="form-input font-mono text-xs" />
                            </FormField>
                            <FormField label="คำอธิบายสั้น">
                                <input type="text" name="short_description" placeholder="สั้นๆ สำหรับหน้ารายการ" className="form-input" />
                            </FormField>
                            <FormField label="รายละเอียด">
                                <textarea name="description" rows={5} placeholder="รายละเอียดแบบเต็ม..." className="form-input resize-y" />
                            </FormField>
                        </FormSection>

                        <FormSection title="ราคา" icon="payments">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="ราคาปกติ (฿)" required>
                                    <input type="number" name="price" required step="0.01" min="0" placeholder="0.00" className="form-input" />
                                </FormField>
                                <FormField label="ราคาลด (฿)">
                                    <input type="number" name="sale_price" step="0.01" min="0" placeholder="ว่าง = ไม่ลด" className="form-input" />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="เริ่มลดราคา">
                                    <input type="datetime-local" name="sale_start" className="form-input" />
                                </FormField>
                                <FormField label="หมดเขตลดราคา">
                                    <input type="datetime-local" name="sale_end" className="form-input" />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="คลังสินค้า" icon="inventory_2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="SKU (รหัสสินค้า)">
                                    <input type="text" name="sku" placeholder="เช่น COURSE-001" className="form-input font-mono" />
                                </FormField>
                                <FormField label="จำนวนในคลัง">
                                    <input type="number" name="stock_quantity" min="0" defaultValue={0} className="form-input" />
                                </FormField>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="manage_stock" id="manage_stock" className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="manage_stock" className="text-sm text-text-sub">จัดการสต็อก (เปิดการนับจำนวน)</label>
                            </div>
                        </FormSection>

                        <FormSection title="รายละเอียดคอร์ส" icon="school">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="ระดับ">
                                    <select name="difficulty_level" className="form-input">
                                        <option value="beginner">เริ่มต้น</option>
                                        <option value="intermediate">กลาง</option>
                                        <option value="advanced">สูง</option>
                                        <option value="all_levels">ทุกระดับ</option>
                                    </select>
                                </FormField>
                                <FormField label="ชั่วโมงเรียน">
                                    <input type="number" name="duration_hours" step="0.5" min="0" placeholder="0" className="form-input" />
                                </FormField>
                                <FormField label="จำนวนบทเรียน">
                                    <input type="number" name="total_lessons" min="0" defaultValue={0} className="form-input" />
                                </FormField>
                            </div>
                        </FormSection>
                    </div>

                    <div className="space-y-6">
                        <FormSection title="เผยแพร่" icon="publish">
                            <FormField label="สถานะ">
                                <select name="status" className="form-input">
                                    <option value="draft">ฉบับร่าง</option>
                                    <option value="published">เผยแพร่</option>
                                </select>
                            </FormField>
                            <FormField label="การมองเห็น">
                                <select name="visibility" className="form-input">
                                    <option value="visible">แสดง</option>
                                    <option value="hidden">ซ่อน</option>
                                    <option value="catalog">แค็ตตาล็อกเท่านั้น</option>
                                    <option value="search">ค้นหาเท่านั้น</option>
                                </select>
                            </FormField>
                            <FormField label="ประเภทสินค้า">
                                <select name="product_type" className="form-input">
                                    <option value="simple">สินค้าเดี่ยว</option>
                                    <option value="variable">มีตัวเลือก</option>
                                    <option value="bundle">ชุดรวม</option>
                                </select>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="is_featured" id="is_featured" className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="is_featured" className="text-sm text-text-sub">⭐ คอร์สแนะนำ</label>
                            </div>
                        </FormSection>

                        <FormSection title="รูปภาพหลัก" icon="image">
                            <FormField label="URL รูปภาพ">
                                <input type="url" name="featured_image" placeholder="https://..." className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="หมวดหมู่" icon="category">
                            <FormField label="เลือกหมวดหมู่">
                                <select name="category_id" className="form-input">
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
                                <input type="text" name="tags" placeholder="TOEIC, ธุรกิจ, ไวยากรณ์" className="form-input" />
                            </FormField>
                        </FormSection>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                            >
                                <MaterialIcon name="save" className="text-lg" />
                                บันทึกคอร์ส
                            </button>
                            <Link
                                href="/admin/courses"
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-text-sub px-5 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                            >
                                ยกเลิก
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
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
                {label}{required && <span className="text-secondary ml-0.5">*</span>}
            </label>
            {children}
        </div>
    )
}
