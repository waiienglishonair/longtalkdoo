'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const supabase = createAdminClient()
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const description = formData.get('description') as string || null
    const image_url = formData.get('image_url') as string || null
    const parent_id = formData.get('parent_id') as string || null
    const sort_order = parseInt(formData.get('sort_order') as string) || 0

    const { error } = await supabase.from('categories').insert({
        name,
        slug,
        description,
        image_url,
        parent_id: parent_id || null,
        sort_order,
    })

    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function updateCategory(formData: FormData) {
    const supabase = createAdminClient()
    const id = formData.get('category_id') as string
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const description = formData.get('description') as string || null
    const image_url = formData.get('image_url') as string || null
    const parent_id = formData.get('parent_id') as string || null
    const sort_order = parseInt(formData.get('sort_order') as string) || 0

    const { error } = await supabase.from('categories').update({
        name,
        slug,
        description,
        image_url,
        parent_id: parent_id || null,
        sort_order,
    }).eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
    const supabase = createAdminClient()
    const id = formData.get('category_id') as string

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/categories')
}
