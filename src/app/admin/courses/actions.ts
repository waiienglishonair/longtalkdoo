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
    const instructorName = formData.get('instructor_name') as string || null
    const instructorBio = formData.get('instructor_bio') as string || null
    const instructorImage = formData.get('instructor_image') as string || null
    const prerequisites = formData.get('prerequisites') as string || null
    const whatYouLearn = formData.get('what_you_learn') as string || null
    const hasCertificate = formData.get('has_certificate') === 'on'
    const certificateTemplate = formData.get('certificate_template') as string || null

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
            instructor_name: instructorName,
            instructor_bio: instructorBio,
            instructor_image: instructorImage,
            prerequisites,
            what_you_learn: whatYouLearn,
            has_certificate: hasCertificate,
            certificate_template: certificateTemplate,
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

// ============================================
// Section CRUD
// ============================================

export async function createSection(formData: FormData) {
    const supabase = createAdminClient()
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string || null

    const { data: maxOrder } = await supabase
        .from('course_sections')
        .select('sort_order')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const sortOrder = (maxOrder?.sort_order ?? -1) + 1

    const { error } = await supabase
        .from('course_sections')
        .insert({ course_id: courseId, title, description, sort_order: sortOrder })

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

export async function updateSection(formData: FormData) {
    const supabase = createAdminClient()
    const sectionId = formData.get('section_id') as string
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string || null

    const { error } = await supabase
        .from('course_sections')
        .update({ title, description })
        .eq('id', sectionId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

export async function deleteSection(formData: FormData) {
    const supabase = createAdminClient()
    const sectionId = formData.get('section_id') as string
    const courseId = formData.get('course_id') as string

    const { error } = await supabase
        .from('course_sections')
        .delete()
        .eq('id', sectionId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

// ============================================
// Lesson CRUD
// ============================================

export async function createLesson(formData: FormData) {
    const supabase = createAdminClient()
    const sectionId = formData.get('section_id') as string
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const lessonType = formData.get('lesson_type') as string || 'video'
    const contentUrl = formData.get('content_url') as string || null
    const contentText = formData.get('content_text') as string || null
    const durationMinutes = parseInt(formData.get('duration_minutes') as string) || 0
    const isPreview = formData.get('is_preview') === 'on'
    const isRequired = formData.get('is_required') !== 'off'

    const { data: maxOrder } = await supabase
        .from('course_lessons')
        .select('sort_order')
        .eq('section_id', sectionId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const sortOrder = (maxOrder?.sort_order ?? -1) + 1

    const { error } = await supabase
        .from('course_lessons')
        .insert({
            section_id: sectionId,
            course_id: courseId,
            title,
            lesson_type: lessonType,
            content_url: contentUrl,
            content_text: contentText,
            duration_minutes: durationMinutes,
            is_preview: isPreview,
            is_required: isRequired,
            sort_order: sortOrder,
        })

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

export async function updateLesson(formData: FormData) {
    const supabase = createAdminClient()
    const lessonId = formData.get('lesson_id') as string
    const courseId = formData.get('course_id') as string
    const title = formData.get('title') as string
    const lessonType = formData.get('lesson_type') as string || 'video'
    const contentUrl = formData.get('content_url') as string || null
    const contentText = formData.get('content_text') as string || null
    const durationMinutes = parseInt(formData.get('duration_minutes') as string) || 0
    const isPreview = formData.get('is_preview') === 'on'
    const isRequired = formData.get('is_required') !== 'off'

    const { error } = await supabase
        .from('course_lessons')
        .update({
            title,
            lesson_type: lessonType,
            content_url: contentUrl,
            content_text: contentText,
            duration_minutes: durationMinutes,
            is_preview: isPreview,
            is_required: isRequired,
        })
        .eq('id', lessonId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

export async function deleteLesson(formData: FormData) {
    const supabase = createAdminClient()
    const lessonId = formData.get('lesson_id') as string
    const courseId = formData.get('course_id') as string

    const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/curriculum`)
}

// ============================================
// Quiz CRUD
// ============================================

export async function createQuiz(formData: FormData) {
    const supabase = createAdminClient()
    const courseId = formData.get('course_id') as string
    const sectionId = formData.get('section_id') as string || null
    const title = formData.get('title') as string
    const description = formData.get('description') as string || null
    const passingScore = parseInt(formData.get('passing_score') as string) || 80
    const maxAttempts = parseInt(formData.get('max_attempts') as string) || 0
    const timeLimitMinutes = formData.get('time_limit_minutes') ? parseInt(formData.get('time_limit_minutes') as string) : null
    const isRequired = formData.get('is_required') !== 'off'

    const { data: maxOrder } = await supabase
        .from('quizzes')
        .select('sort_order')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const sortOrder = (maxOrder?.sort_order ?? -1) + 1

    const { error } = await supabase
        .from('quizzes')
        .insert({
            course_id: courseId,
            section_id: sectionId || null,
            title,
            description,
            passing_score: passingScore,
            max_attempts: maxAttempts,
            time_limit_minutes: timeLimitMinutes,
            is_required: isRequired,
            sort_order: sortOrder,
        })

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/quizzes`)
}

export async function updateQuiz(formData: FormData) {
    const supabase = createAdminClient()
    const quizId = formData.get('quiz_id') as string
    const courseId = formData.get('course_id') as string
    const sectionId = formData.get('section_id') as string || null
    const title = formData.get('title') as string
    const description = formData.get('description') as string || null
    const passingScore = parseInt(formData.get('passing_score') as string) || 80
    const maxAttempts = parseInt(formData.get('max_attempts') as string) || 0
    const timeLimitMinutes = formData.get('time_limit_minutes') ? parseInt(formData.get('time_limit_minutes') as string) : null
    const isRequired = formData.get('is_required') !== 'off'

    const { error } = await supabase
        .from('quizzes')
        .update({
            section_id: sectionId || null,
            title,
            description,
            passing_score: passingScore,
            max_attempts: maxAttempts,
            time_limit_minutes: timeLimitMinutes,
            is_required: isRequired,
        })
        .eq('id', quizId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/quizzes`)
}

export async function deleteQuiz(formData: FormData) {
    const supabase = createAdminClient()
    const quizId = formData.get('quiz_id') as string
    const courseId = formData.get('course_id') as string

    const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/quizzes`)
}

// ============================================
// Quiz Question CRUD
// ============================================

export async function createQuizQuestion(formData: FormData) {
    const supabase = createAdminClient()
    const quizId = formData.get('quiz_id') as string
    const courseId = formData.get('course_id') as string
    const questionText = formData.get('question_text') as string
    const questionType = formData.get('question_type') as string || 'multiple_choice'
    const correctAnswer = formData.get('correct_answer') as string
    const explanation = formData.get('explanation') as string || null
    const points = parseInt(formData.get('points') as string) || 1

    let options = null
    if (questionType === 'multiple_choice') {
        const optionA = formData.get('option_a') as string || ''
        const optionB = formData.get('option_b') as string || ''
        const optionC = formData.get('option_c') as string || ''
        const optionD = formData.get('option_d') as string || ''
        options = [optionA, optionB, optionC, optionD].filter(Boolean)
    } else if (questionType === 'true_false') {
        options = ['จริง', 'ไม่จริง']
    }

    const { data: maxOrder } = await supabase
        .from('quiz_questions')
        .select('sort_order')
        .eq('quiz_id', quizId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

    const sortOrder = (maxOrder?.sort_order ?? -1) + 1

    const { error } = await supabase
        .from('quiz_questions')
        .insert({
            quiz_id: quizId,
            question_text: questionText,
            question_type: questionType,
            options,
            correct_answer: correctAnswer,
            explanation,
            points,
            sort_order: sortOrder,
        })

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/quizzes`)
}

export async function deleteQuizQuestion(formData: FormData) {
    const supabase = createAdminClient()
    const questionId = formData.get('question_id') as string
    const courseId = formData.get('course_id') as string

    const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId)

    if (error) throw new Error(error.message)
    revalidatePath(`/admin/courses/${courseId}/quizzes`)
}
