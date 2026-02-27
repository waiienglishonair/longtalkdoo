import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateCategory } from '../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (!category) notFound()

    // Get parent categories (exclude self)
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, parent_id')
        .is('parent_id', null)
        .neq('id', id)
        .order('sort_order', { ascending: true })

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">แก้ไขหมวดหมู่</h1>
                    <p className="text-text-sub text-sm">{category.name}</p>
                </div>
            </div>

            <form action={updateCategory} className="space-y-6">
                <input type="hidden" name="category_id" value={category.id} />

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
                            <input type="text" name="name" required defaultValue={category.name} className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">Slug (URL)</label>
                            <input type="text" name="slug" defaultValue={category.slug} className="form-input font-mono text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">คำอธิบาย</label>
                            <textarea name="description" rows={3} defaultValue={category.description || ''} className="form-input resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1.5">URL รูปไอคอน</label>
                            <input type="url" name="image_url" defaultValue={category.image_url || ''} placeholder="https://example.com/icon.png" className="form-input" />
                            {category.image_url && (
                                <div className="mt-2 flex items-center gap-3">
                                    <img src={category.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                                    <span className="text-xs text-text-sub">ไอคอนปัจจุบัน</span>
                                </div>
                            )}
                            <p className="text-[10px] text-text-sub mt-1">รูปภาพขนาดเล็กที่ใช้เป็นไอคอนของหมวดหมู่</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">หมวดหมู่หลัก</label>
                                <select name="parent_id" defaultValue={category.parent_id || ''} className="form-input">
                                    <option value="">— ไม่มี (หมวดหลัก) —</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-sub mb-1.5">ลำดับการแสดง</label>
                                <input type="number" name="sort_order" min="0" defaultValue={category.sort_order} className="form-input" />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                    <MaterialIcon name="save" className="text-lg" />
                    อัปเดตหมวดหมู่
                </button>
            </form>
        </div>
    )
}
