'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createTag(formData: FormData) {
    const supabase = createAdminClient()
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { error } = await supabase.from('course_tags').insert({ name, slug })
    if (error) throw new Error(error.message)

    revalidatePath('/admin/tags')
}

export async function updateTag(formData: FormData) {
    const supabase = createAdminClient()
    const id = formData.get('tag_id') as string
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { error } = await supabase.from('course_tags').update({ name, slug }).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/tags')
}

export async function deleteTag(formData: FormData) {
    const supabase = createAdminClient()
    const id = formData.get('tag_id') as string

    const { error } = await supabase.from('course_tags').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/tags')
}
