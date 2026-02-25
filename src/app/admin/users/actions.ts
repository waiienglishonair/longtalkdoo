'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserRole(formData: FormData) {
    const supabase = createAdminClient()
    const userId = formData.get('userId') as string
    const newRole = formData.get('role') as string

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        console.error('Update role error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/users')
}

export async function updateUserProfile(formData: FormData) {
    const supabase = createAdminClient()
    const userId = formData.get('userId') as string
    const displayName = formData.get('display_name') as string
    const role = formData.get('role') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            display_name: displayName,
            role,
        })
        .eq('id', userId)

    if (error) {
        console.error('Update profile error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}

export async function deleteUser(formData: FormData) {
    const supabase = createAdminClient()
    const userId = formData.get('userId') as string

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
        console.error('Delete user error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/users')
    redirect('/admin/users')
}
