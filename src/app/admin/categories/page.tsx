import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'
import { deleteCategory } from './actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function AdminCategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const params = await searchParams
    const searchQuery = params.search || ''

    const supabase = createAdminClient()

    let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data: categories, error } = await query

    // Fetch course counts per category from join table
    const { data: courseCounts } = await supabase
        .from('course_categories')
        .select('category_id')

    const countMap: Record<string, number> = {}
    courseCounts?.forEach(row => {
        countMap[row.category_id] = (countMap[row.category_id] || 0) + 1
    })

    // Build parent lookup
    const parentMap: Record<string, string> = {}
    categories?.forEach(c => { parentMap[c.id] = c.name })

    // Separate into parents and children
    const parents = categories?.filter(c => !c.parent_id) || []
    const children = categories?.filter(c => c.parent_id) || []

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-text-main">หมวดหมู่</h1>
                    <p className="text-text-sub text-sm">จัดการหมวดหมู่คอร์สเรียน · {categories?.length || 0} หมวดหมู่</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <MaterialIcon name="add" className="text-lg" />
                    เพิ่มหมวดหมู่ใหม่
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                    <form method="GET" action="/admin/categories" className="flex gap-3">
                        <div className="relative flex-1">
                            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="ค้นหาชื่อหมวดหมู่..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-text-sub hover:bg-gray-200 transition-colors">
                            ค้นหา
                        </button>
                    </form>
                </div>

                {/* Table */}
                {categories && categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3.5 text-left">หมวดหมู่</th>
                                    <th className="px-5 py-3.5 text-left">ไอคอน</th>
                                    <th className="px-5 py-3.5 text-center">คอร์ส</th>
                                    <th className="px-5 py-3.5 text-left">หมวดหมู่หลัก</th>
                                    <th className="px-5 py-3.5 text-left">Slug</th>
                                    <th className="px-5 py-3.5 text-center">ลำดับ</th>
                                    <th className="px-5 py-3.5 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.map(category => (
                                    <CategoryRows
                                        key={category.id}
                                        category={category}
                                        parentName={null}
                                        isChild={false}
                                        courseCount={countMap[category.id] || 0}
                                        childCategories={children.filter(c => c.parent_id === category.id)}
                                        countMap={countMap}
                                    />
                                ))}
                                {/* Orphan children */}
                                {children
                                    .filter(c => !parents.find(p => p.id === c.parent_id))
                                    .map(child => (
                                        <CategoryRow
                                            key={child.id}
                                            category={child}
                                            parentName={parentMap[child.parent_id] || '(ลบแล้ว)'}
                                            isChild={true}
                                            courseCount={countMap[child.id] || 0}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <MaterialIcon name="category" className="text-3xl text-gray-400" />
                            </div>
                            <p className="text-text-sub font-medium">
                                {error ? `เกิดข้อผิดพลาด: ${error.message}` : 'ยังไม่มีหมวดหมู่'}
                            </p>
                            <Link href="/admin/categories/new" className="text-sm text-primary font-bold hover:underline">
                                + เพิ่มหมวดหมู่แรก
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function CategoryRows({
    category,
    parentName,
    isChild,
    courseCount,
    childCategories,
    countMap,
}: {
    category: { id: string; name: string; slug: string; image_url: string | null; sort_order: number; parent_id: string | null }
    parentName: string | null
    isChild: boolean
    courseCount: number
    childCategories: { id: string; name: string; slug: string; image_url: string | null; sort_order: number; parent_id: string | null }[]
    countMap: Record<string, number>
}) {
    return (
        <>
            <CategoryRow category={category} parentName={parentName} isChild={isChild} courseCount={courseCount} />
            {childCategories.map(child => (
                <CategoryRow key={child.id} category={child} parentName={category.name} isChild={true} courseCount={countMap[child.id] || 0} />
            ))}
        </>
    )
}

function CategoryRow({
    category,
    parentName,
    isChild,
    courseCount,
}: {
    category: { id: string; name: string; slug: string; image_url: string | null; sort_order: number; parent_id: string | null }
    parentName: string | null
    isChild: boolean
    courseCount: number
}) {
    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    {isChild && <span className="text-gray-300 ml-2">└</span>}
                    <span className={`font-medium text-text-main ${isChild ? 'text-sm' : 'font-bold'}`}>
                        {category.name}
                    </span>
                </div>
            </td>
            <td className="px-5 py-3.5">
                {category.image_url ? (
                    <img src={category.image_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                ) : (
                    <span className="text-gray-300 text-xs">—</span>
                )}
            </td>
            <td className="px-5 py-3.5 text-center">
                {courseCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <MaterialIcon name="menu_book" className="text-[12px]" />
                        {courseCount}
                    </span>
                ) : (
                    <span className="text-gray-300 text-xs">0</span>
                )}
            </td>
            <td className="px-5 py-3.5">
                {parentName ? (
                    <span className="text-xs bg-gray-100 text-text-sub px-2 py-0.5 rounded-full">{parentName}</span>
                ) : (
                    <span className="text-gray-300 text-xs">—</span>
                )}
            </td>
            <td className="px-5 py-3.5">
                <span className="text-xs font-mono text-text-sub bg-gray-50 px-2 py-0.5 rounded">{category.slug}</span>
            </td>
            <td className="px-5 py-3.5 text-center">
                <span className="text-xs text-text-sub">{category.sort_order}</span>
            </td>
            <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-1">
                    <Link
                        href={`/admin/categories/${category.id}`}
                        className="p-2 rounded-lg text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
                        title="แก้ไข"
                    >
                        <MaterialIcon name="edit" className="text-lg" />
                    </Link>
                    <form action={deleteCategory}>
                        <input type="hidden" name="category_id" value={category.id} />
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
    )
}
