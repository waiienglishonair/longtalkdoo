import Link from 'next/link'
import { createInstructor } from '../actions'

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

export default function NewInstructorPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/instructors" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">เพิ่มผู้สอนใหม่</h1>
                    <p className="text-text-sub text-sm">กรอกข้อมูลผู้สอนด้านล่าง</p>
                </div>
            </div>

            <form action={createInstructor} className="space-y-6">
                <FormSection title="ข้อมูลทั่วไป" icon="person">
                    <FormField label="ชื่อผู้สอน" required>
                        <input type="text" name="name" required placeholder="เช่น อาจารย์สมเกียรติ" className="form-input" />
                    </FormField>
                    <FormField label="Slug (URL)">
                        <input type="text" name="slug" placeholder="เว้นว่างจะสร้างจากชื่ออัตโนมัติ" className="form-input" />
                    </FormField>
                    <FormField label="จุดเด่น / Highlight">
                        <input type="text" name="highlight" placeholder="เช่น ผู้เชี่ยวชาญ Excel 15+ ปี" className="form-input" />
                    </FormField>
                    <FormField label="ประวัติ / Bio">
                        <textarea name="bio" rows={5} placeholder="ประวัติและประสบการณ์ของผู้สอน..." className="form-input" />
                    </FormField>
                </FormSection>

                <FormSection title="รูปภาพ" icon="image">
                    <FormField label="รูปโปรไฟล์ (Profile Image URL)">
                        <input type="url" name="image" placeholder="https://..." className="form-input" />
                    </FormField>
                    <FormField label="รูปปก / Cover Photo URL">
                        <input type="url" name="cover_photo" placeholder="https://..." className="form-input" />
                    </FormField>
                </FormSection>

                <FormSection title="การแสดงผล" icon="visibility">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="is_featured" className="w-4 h-4 accent-primary rounded" />
                        <span className="text-sm text-text-main group-hover:text-primary transition-colors">⭐ ตั้งเป็นผู้สอนแนะนำ</span>
                    </label>
                </FormSection>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        บันทึกผู้สอน
                    </button>
                    <Link href="/admin/instructors" className="px-6 py-3 text-text-sub text-sm font-medium hover:text-text-main transition-colors">
                        ยกเลิก
                    </Link>
                </div>
            </form>
        </div>
    )
}
