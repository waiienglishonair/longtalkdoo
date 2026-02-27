import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { createTag, updateTag, deleteTag } from './actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminTagsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; edit?: string }>
}) {
    const params = await searchParams
    const searchQuery = params.search || ''
    const editingId = params.edit || ''

    const supabase = createAdminClient()

    let query = supabase
        .from('course_tags')
        .select('*')
        .order('name', { ascending: true })

    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data: tags, error } = await query

    // Fetch course counts per tag from join table
    const { data: tagCounts } = await supabase
        .from('course_tag_map')
        .select('tag_id')

    const countMap: Record<string, number> = {}
    tagCounts?.forEach(row => {
        countMap[row.tag_id] = (countMap[row.tag_id] || 0) + 1
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-text-main">แท็ก</h1>
                    <p className="text-text-sub text-sm">จัดการแท็กคอร์สเรียน · {tags?.length || 0} แท็ก</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Create / Edit Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 rounded-t-2xl">
                            <MaterialIcon name={editingId ? 'edit' : 'add'} className="text-primary text-lg" />
                            <h3 className="font-bold text-sm text-text-main">
                                {editingId ? 'แก้ไขแท็ก' : 'เพิ่มแท็กใหม่'}
                            </h3>
                        </div>
                        <div className="p-5">
                            {editingId ? (
                                <EditTagForm tag={tags?.find(t => t.id === editingId) || null} />
                            ) : (
                                <form action={createTag} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-text-sub mb-1.5">
                                            ชื่อแท็ก <span className="text-secondary">*</span>
                                        </label>
                                        <input type="text" name="name" required placeholder="เช่น TOEIC" className="form-input" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-text-sub mb-1.5">Slug</label>
                                        <input type="text" name="slug" placeholder="สร้างอัตโนมัติ" className="form-input font-mono text-xs" />
                                    </div>
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
                                        <MaterialIcon name="add" className="text-lg" />
                                        เพิ่มแท็ก
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Tags List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-100">
                            <form method="GET" action="/admin/tags" className="flex gap-3">
                                <div className="relative flex-1">
                                    <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={searchQuery}
                                        placeholder="ค้นหาแท็ก..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-text-sub hover:bg-gray-200 transition-colors">
                                    ค้นหา
                                </button>
                            </form>
                        </div>

                        {/* Tags Table */}
                        {tags && tags.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left">แท็ก</th>
                                            <th className="px-5 py-3.5 text-center">คอร์ส</th>
                                            <th className="px-5 py-3.5 text-left">Slug</th>
                                            <th className="px-5 py-3.5 text-left">สร้างเมื่อ</th>
                                            <th className="px-5 py-3.5 text-right">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tags.map(tag => (
                                            <tr key={tag.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${editingId === tag.id ? 'bg-primary/5' : ''}`}>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <MaterialIcon name="label" className="text-primary text-base" />
                                                        <span className="font-medium text-text-main">{tag.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    {(countMap[tag.id] || 0) > 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                            <MaterialIcon name="menu_book" className="text-[12px]" />
                                                            {countMap[tag.id]}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">0</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-xs font-mono text-text-sub bg-gray-50 px-2 py-0.5 rounded">{tag.slug}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-xs text-text-sub">
                                                    {new Date(tag.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/admin/tags?edit=${tag.id}`}
                                                            className="p-2 rounded-lg text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
                                                            title="แก้ไข"
                                                        >
                                                            <MaterialIcon name="edit" className="text-lg" />
                                                        </Link>
                                                        <form action={deleteTag}>
                                                            <input type="hidden" name="tag_id" value={tag.id} />
                                                            <button
                                                                type="submit"
                                                                className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors"
                                                                title="ลบ"
                                                            >
                                                                <MaterialIcon name="delete" className="text-lg" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                        <MaterialIcon name="label" className="text-3xl text-gray-400" />
                                    </div>
                                    <p className="text-text-sub font-medium">
                                        {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ยังไม่มีแท็ก'}
                                    </p>
                                    <p className="text-xs text-text-sub">เพิ่มแท็กแรกจากฟอร์มด้านซ้าย</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditTagForm({ tag }: { tag: { id: string; name: string; slug: string } | null }) {
    if (!tag) {
        return (
            <div className="text-center py-4">
                <p className="text-sm text-text-sub">ไม่พบแท็กนี้</p>
                <Link href="/admin/tags" className="text-xs text-primary font-bold hover:underline mt-2 inline-block">กลับ</Link>
            </div>
        )
    }
    return (
        <form action={updateTag} className="space-y-4">
            <input type="hidden" name="tag_id" value={tag.id} />
            <div>
                <label className="block text-xs font-medium text-text-sub mb-1.5">
                    ชื่อแท็ก <span className="text-secondary">*</span>
                </label>
                <input type="text" name="name" required defaultValue={tag.name} className="form-input" />
            </div>
            <div>
                <label className="block text-xs font-medium text-text-sub mb-1.5">Slug</label>
                <input type="text" name="slug" defaultValue={tag.slug} className="form-input font-mono text-xs" />
            </div>
            <div className="flex gap-2">
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
                    <MaterialIcon name="save" className="text-lg" />
                    บันทึก
                </button>
                <Link href="/admin/tags" className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-text-sub rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
                    ยกเลิก
                </Link>
            </div>
        </form>
    )
}
