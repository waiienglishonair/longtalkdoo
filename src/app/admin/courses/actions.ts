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

export async function createCourse(formData: FormData) {
    const supabase = createAdminClient()

    const name = formData.get('name') as string
    const slug = (formData.get('slug') as string) || generateSlug(name)
    const description = formData.get('description') as string || null
    const shortDescription = formData.get('short_description') as string || null
    const status = formData.get('status') as string || 'draft'
    const productType = formData.get('product_type') as string || 'simple'
    const price = parseFloat(formData.get('price') as string) || 0
    const salePrice = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null
    const saleStart = formData.get('sale_start') as string || null
    const saleEnd = formData.get('sale_end') as string || null
    const sku = formData.get('sku') as string || null
    const manageStock = formData.get('manage_stock') === 'on'
    const stockQuantity = parseInt(formData.get('stock_quantity') as string) || 0
    const featuredImage = formData.get('featured_image') as string || null
    const isFeatured = formData.get('is_featured') === 'on'
    const visibility = formData.get('visibility') as string || 'visible'
    const difficultyLevel = formData.get('difficulty_level') as string || 'beginner'
    const durationHours = formData.get('duration_hours') ? parseFloat(formData.get('duration_hours') as string) : null
    const totalLessons = parseInt(formData.get('total_lessons') as string) || 0
    const categoryId = formData.get('category_id') as string || null

    const { data: course, error } = await supabase
        .from('courses')
        .insert({
            name,
            slug,
            description,
            short_description: shortDescription,
            status,
            product_type: productType,
            price,
            sale_price: salePrice,
            sale_start: saleStart || null,
            sale_end: saleEnd || null,
            sku,
            manage_stock: manageStock,
            stock_quantity: stockQuantity,
            featured_image: featuredImage,
            is_featured: isFeatured,
            visibility,
            difficulty_level: difficultyLevel,
            duration_hours: durationHours,
            total_lessons: totalLessons,
            published_at: status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single()

    if (error) {
        console.error('Create course error:', error)
        throw new Error(error.message)
    }

    // Link category if provided
    if (categoryId && course) {
        await supabase
            .from('course_categories')
            .insert({ course_id: course.id, category_id: categoryId })
    }

    // Handle tags
    const tagsRaw = formData.get('tags') as string
    if (tagsRaw && course) {
        const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
        for (const tagName of tagNames) {
            const tagSlug = generateSlug(tagName)
            const { data: tag } = await supabase
                .from('course_tags')
                .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'slug' })
                .select()
                .single()
            if (tag) {
                await supabase
                    .from('course_tag_map')
                    .upsert({ course_id: course.id, tag_id: tag.id })
            }
        }
    }

    revalidatePath('/admin/courses')
    redirect('/admin/courses')
}

export async function updateCourse(formData: FormData) {
    const supabase = createAdminClient()
    const courseId = formData.get('course_id') as string

    const name = formData.get('name') as string
    const slug = (formData.get('slug') as string) || generateSlug(name)
    const description = formData.get('description') as string || null
    const shortDescription = formData.get('short_description') as string || null
    const status = formData.get('status') as string || 'draft'
    const productType = formData.get('product_type') as string || 'simple'
    const price = parseFloat(formData.get('price') as string) || 0
    const salePrice = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null
    const saleStart = formData.get('sale_start') as string || null
    const saleEnd = formData.get('sale_end') as string || null
    const sku = formData.get('sku') as string || null
    const manageStock = formData.get('manage_stock') === 'on'
    const stockQuantity = parseInt(formData.get('stock_quantity') as string) || 0
    const featuredImage = formData.get('featured_image') as string || null
    const isFeatured = formData.get('is_featured') === 'on'
    const visibility = formData.get('visibility') as string || 'visible'
    const difficultyLevel = formData.get('difficulty_level') as string || 'beginner'
    const durationHours = formData.get('duration_hours') ? parseFloat(formData.get('duration_hours') as string) : null
    const totalLessons = parseInt(formData.get('total_lessons') as string) || 0
    const categoryId = formData.get('category_id') as string || null

    const { data: currentCourse } = await supabase
        .from('courses')
        .select('status, published_at')
        .eq('id', courseId)
        .single()

    const publishedAt = status === 'published' && currentCourse?.status !== 'published'
        ? new Date().toISOString()
        : currentCourse?.published_at || null

    const { error } = await supabase
        .from('courses')
        .update({
            name,
            slug,
            description,
            short_description: shortDescription,
            status,
            product_type: productType,
            price,
            sale_price: salePrice,
            sale_start: saleStart || null,
            sale_end: saleEnd || null,
            sku,
            manage_stock: manageStock,
            stock_quantity: stockQuantity,
            featured_image: featuredImage,
            is_featured: isFeatured,
            visibility,
            difficulty_level: difficultyLevel,
            duration_hours: durationHours,
            total_lessons: totalLessons,
            published_at: publishedAt,
        })
        .eq('id', courseId)

    if (error) {
        console.error('Update course error:', error)
        throw new Error(error.message)
    }

    await supabase
        .from('course_categories')
        .delete()
        .eq('course_id', courseId)

    if (categoryId) {
        await supabase
            .from('course_categories')
            .insert({ course_id: courseId, category_id: categoryId })
    }

    const tagsRaw = formData.get('tags') as string
    await supabase
        .from('course_tag_map')
        .delete()
        .eq('course_id', courseId)

    if (tagsRaw) {
        const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
        for (const tagName of tagNames) {
            const tagSlug = generateSlug(tagName)
            const { data: tag } = await supabase
                .from('course_tags')
                .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'slug' })
                .select()
                .single()
            if (tag) {
                await supabase
                    .from('course_tag_map')
                    .upsert({ course_id: courseId, tag_id: tag.id })
            }
        }
    }

    revalidatePath('/admin/courses')
    redirect('/admin/courses')
}

export async function deleteCourse(formData: FormData) {
    const supabase = createAdminClient()
    const courseId = formData.get('course_id') as string

    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

    if (error) {
        console.error('Delete course error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/courses')
    redirect('/admin/courses')
}

export async function toggleCourseStatus(formData: FormData) {
    const supabase = createAdminClient()
    const courseId = formData.get('course_id') as string
    const currentStatus = formData.get('current_status') as string

    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const updates: Record<string, unknown> = { status: newStatus }

    if (newStatus === 'published') {
        updates.published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId)

    if (error) {
        console.error('Toggle status error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/courses')
}

export async function createCategory(formData: FormData) {
    const supabase = createAdminClient()
    const name = formData.get('name') as string
    const slug = generateSlug(name)
    const description = formData.get('description') as string || null
    const parentId = formData.get('parent_id') as string || null

    const { error } = await supabase
        .from('categories')
        .insert({ name, slug, description, parent_id: parentId || null })

    if (error) {
        console.error('Create category error:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/courses')
}
