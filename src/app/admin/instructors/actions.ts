'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100) || 'untitled'
}

export async function createInstructor(formData: FormData) {
    const supabase = createAdminClient()

    const name = formData.get('name') as string
    const slug = (formData.get('slug') as string) || generateSlug(name)
    const highlight = formData.get('highlight') as string || null
    const bio = formData.get('bio') as string || null
    const image = formData.get('image') as string || null
    const coverPhoto = formData.get('cover_photo') as string || null
    const isFeatured = formData.get('is_featured') === 'on'

    const { error } = await supabase
        .from('instructors')
        .insert({
            name,
            slug,
            highlight,
            bio,
            image,
            cover_photo: coverPhoto,
            is_featured: isFeatured,
        })

    if (error) {
        console.error('Create instructor error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/instructors')
    redirect('/admin/instructors')
}

export async function updateInstructor(formData: FormData) {
    const supabase = createAdminClient()
    const instructorId = formData.get('instructor_id') as string

    const name = formData.get('name') as string
    const slug = (formData.get('slug') as string) || generateSlug(name)
    const highlight = formData.get('highlight') as string || null
    const bio = formData.get('bio') as string || null
    const image = formData.get('image') as string || null
    const coverPhoto = formData.get('cover_photo') as string || null
    const isFeatured = formData.get('is_featured') === 'on'

    const { error } = await supabase
        .from('instructors')
        .update({
            name,
            slug,
            highlight,
            bio,
            image,
            cover_photo: coverPhoto,
            is_featured: isFeatured,
        })
        .eq('id', instructorId)

    if (error) {
        console.error('Update instructor error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/instructors')
    redirect('/admin/instructors')
}

export async function deleteInstructor(formData: FormData) {
    const supabase = createAdminClient()
    const instructorId = formData.get('instructor_id') as string

    const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', instructorId)

    if (error) {
        console.error('Delete instructor error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/instructors')
    redirect('/admin/instructors')
}

export async function toggleInstructorFeatured(formData: FormData) {
    const supabase = createAdminClient()
    const instructorId = formData.get('instructor_id') as string
    const currentFeatured = formData.get('current_featured') === 'true'

    const { error } = await supabase
        .from('instructors')
        .update({ is_featured: !currentFeatured })
        .eq('id', instructorId)

    if (error) {
        console.error('Toggle featured error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/instructors')
}
