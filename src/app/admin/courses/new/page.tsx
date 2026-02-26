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

    const { data: instructors } = await supabase
        .from('instructors')
        .select('id, name')
        .order('name', { ascending: true })

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/courses" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">เพิ่มคอร์สใหม่</h1>
                    <p className="text-text-sub text-sm">สร้างคอร์สเรียนใหม่</p>
                </div>
            </div>

            <form action={createCourse}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* General Info */}
                        <FormSection title="ข้อมูลทั่วไป" icon="info">
                            <FormField label="ชื่อคอร์ส" required>
                                <input type="text" name="name" required placeholder="เช่น ภาษาอังกฤษธุรกิจ Pro" className="form-input" />
                            </FormField>
                            <FormField label="Slug (URL)">
                                <input type="text" name="slug" placeholder="สร้างอัตโนมัติจากชื่อ" className="form-input font-mono text-xs" />
                            </FormField>
                            <FormField label="รายละเอียด">
                                <textarea name="description" rows={5} placeholder="รายละเอียดแบบเต็ม..." className="form-input resize-y" />
                            </FormField>
                        </FormSection>

                        {/* Pricing */}
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

                        {/* Access & Duration */}
                        <FormSection title="ระยะเวลาเข้าถึง" icon="schedule">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="ระยะเวลา">
                                    <input type="number" name="access_duration_value" min="0" defaultValue={0} placeholder="0 = ตลอดชีพ" className="form-input" />
                                </FormField>
                                <FormField label="หน่วย">
                                    <select name="access_duration_unit" className="form-input">
                                        <option value="lifetime">ตลอดชีพ (Lifetime)</option>
                                        <option value="minute">นาที</option>
                                        <option value="hour">ชั่วโมง</option>
                                        <option value="day">วัน</option>
                                        <option value="week">สัปดาห์</option>
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="บล็อกเนื้อหา">
                                <select name="block_content" className="form-input">
                                    <option value="on_expiry">บล็อกเมื่อหมดเวลาเข้าถึง</option>
                                    <option value="on_completion">บล็อกเมื่อเรียนจบแล้ว</option>
                                </select>
                            </FormField>
                        </FormSection>

                        {/* Repurchase */}
                        <FormSection title="ซื้อซ้ำ" icon="replay">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="allow_repurchase" id="allow_repurchase" className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="allow_repurchase" className="text-sm text-text-sub">อนุญาตให้ซื้อซ้ำ</label>
                            </div>
                            <FormField label="เมื่อซื้อซ้ำ">
                                <select name="repurchase_action" className="form-input">
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
                                    <select name="difficulty_level" className="form-input">
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </FormField>
                                <FormField label="จำนวนเรียนซ้ำ (Re-take)">
                                    <input type="number" name="retake_count" min="0" defaultValue={0} placeholder="0 = ปิด" className="form-input" />
                                </FormField>
                                <FormField label="จำนวนผู้เรียนสูงสุด">
                                    <input type="number" name="max_students" min="0" defaultValue={0} placeholder="0 = ไม่จำกัด" className="form-input" />
                                </FormField>
                            </div>
                            <FormField label="จำนวนผู้เรียน (แสดงอย่างเดียว)">
                                <input type="number" name="fake_students_enrolled" min="0" defaultValue={0} className="form-input" />
                                <p className="text-[10px] text-text-sub mt-1">แสดงเป็นตัวเลข ไม่ถูกนำไปคำนวณ</p>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="show_finish_button" id="show_finish_button" defaultChecked className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="show_finish_button" className="text-sm text-text-sub">แสดงปุ่ม &quot;เรียนจบ&quot; ก่อนผ่านการประเมิน</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="no_enroll_requirement" id="no_enroll_requirement" className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="no_enroll_requirement" className="text-sm text-text-sub">ไม่ต้องสมัครสมาชิก — ดูเนื้อหาและทำแบบทดสอบได้เลย</label>
                            </div>
                        </FormSection>

                        {/* Evaluation */}
                        <FormSection title="การประเมินผล" icon="assessment">
                            <FormField label="วิธีประเมิน">
                                <select name="evaluation_method" className="form-input">
                                    <option value="lessons">ประเมินจากบทเรียน (Evaluate via lessons)</option>
                                    <option value="final_quiz">ประเมินจากแบบทดสอบปลายภาค (Final quiz)</option>
                                    <option value="passed_quizzes">ประเมินจากแบบทดสอบที่ผ่าน (Passed quizzes)</option>
                                    <option value="questions">ประเมินจากคำถาม (Questions)</option>
                                    <option value="mark">ประเมินจากเครื่องหมาย (Mark)</option>
                                </select>
                            </FormField>
                            <FormField label="คะแนนผ่าน (%)">
                                <input type="number" name="passing_grade" min="0" max="100" step="0.01" defaultValue={0} className="form-input" />
                            </FormField>
                        </FormSection>

                        {/* Course Features */}
                        <FormSection title="สิ่งที่ได้รับ" icon="checklist">
                            <FormField label="รายการ (บรรทัดละข้อ)">
                                <textarea name="course_features" rows={5} placeholder={"วิดีโอ 10+ ชั่วโมง\nแบบฝึกหัดท้ายบท\nใบ Certificate\nเข้าถึงตลอดชีพ"} className="form-input resize-y" />
                                <p className="text-[10px] text-text-sub mt-1">แต่ละบรรทัดจะแสดงเป็น bullet</p>
                            </FormField>
                        </FormSection>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        <FormSection title="เผยแพร่" icon="publish">
                            <FormField label="สถานะ">
                                <select name="status" className="form-input">
                                    <option value="draft">ฉบับร่าง</option>
                                    <option value="published">เผยแพร่</option>
                                </select>
                            </FormField>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="is_featured" id="is_featured" className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="is_featured" className="text-sm text-text-sub">⭐ คอร์สแนะนำ</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="enable_reviews" id="enable_reviews" defaultChecked className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="enable_reviews" className="text-sm text-text-sub">เปิดให้รีวิว</label>
                            </div>
                        </FormSection>

                        <FormSection title="รูปภาพหลัก" icon="image">
                            <FormField label="URL รูปภาพ">
                                <input type="url" name="featured_image" placeholder="https://..." className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="วิดีโอแนะนำ" icon="play_circle">
                            <FormField label="Embed URL (iframe)">
                                <input type="url" name="media_intro" placeholder="https://youtube.com/embed/..." className="form-input" />
                            </FormField>
                        </FormSection>

                        <FormSection title="ผู้สอน" icon="school">
                            <FormField label="เลือกผู้สอน">
                                <select name="instructor_id" className="form-input">
                                    <option value="">— ไม่ระบุ —</option>
                                    {instructors?.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
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
                            <FormField label="แท็ก (คั่นด้วย ,)">
                                <input type="text" name="tags" placeholder="TOEIC, ธุรกิจ, ไวยากรณ์" className="form-input" />
                            </FormField>
                        </FormSection>

                        <div className="flex flex-col gap-3">
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                                <MaterialIcon name="save" className="text-lg" />
                                บันทึกคอร์ส
                            </button>
                            <Link href="/admin/courses" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-text-sub px-5 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
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
