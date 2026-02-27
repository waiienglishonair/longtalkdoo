import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { createCategory } from '../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function NewCategoryPage() {
    const supabase = createAdminClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .is('parent_id', null)
        .order('sort_order', { ascending: true })

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">เพิ่มหมวดหมู่ใหม่</h1>
                    <p className="text-text-sub text-sm">สร้างหมวดหมู่คอร์สใหม่</p>
                </div>
            </div>

            <form action={createCategory} className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 rounded-t-2xl">
                        <MaterialIcon name="category" className="text-primary text-lg" />
                        <h3 className="font-bold text-sm text-text-main">ข้อมูลหมวดหมู่</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">
                                ชื่อหมวดหมู่ <span className="text-secondary">*</span>
                            </label>
                            <input type="text" name="name" required placeholder="เช่น ภาษาอังกฤษพื้นฐาน" className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">Slug (URL)</label>
                            <input type="text" name="slug" placeholder="สร้างอัตโนมัติจากชื่อ" className="form-input font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">คำอธิบาย</label>
                            <textarea name="description" rows={3} placeholder="รายละเอียดหมวดหมู่..." className="form-input resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">URL รูปไอคอน</label>
                            <input type="url" name="image_url" placeholder="https://example.com/icon.png" className="form-input" />
                            <p className="text-[10px] text-text-sub mt-1">รูปภาพขนาดเล็กที่ใช้เป็นไอคอนของหมวดหมู่</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">หมวดหมู่หลัก</label>
                                <select name="parent_id" className="form-input">
                                    <option value="">— ไม่มี (หมวดหลัก) —</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">ลำดับการแสดง</label>
                                <input type="number" name="sort_order" min="0" defaultValue={0} className="form-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                    <MaterialIcon name="save" className="text-lg" />
                    บันทึกหมวดหมู่
                </button>
            </form>
        </div>
    )
}
