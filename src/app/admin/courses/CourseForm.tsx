'use client'

import { useState, useRef, useCallback } from 'react'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

// ─── Types ───
interface Instructor { id: string; name: string }
interface Category { id: string; name: string; parent_id: string | null }
interface Section { id: string; title: string; description: string | null; sort_order: number }
interface Lesson { id: string; section_id: string; title: string; lesson_type: string; sort_order: number }
interface Quiz { id: string; section_id: string | null; title: string; sort_order: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CourseData { [key: string]: any }

interface CourseFormProps {
    course?: CourseData | null
    categories: Category[]
    instructors: Instructor[]
    sections?: Section[]
    lessons?: Lesson[]
    quizzes?: Quiz[]
    currentCategoryId?: string
    currentTags?: string
    action: (formData: FormData) => Promise<void>
    // Curriculum actions
    createSection?: (formData: FormData) => Promise<void>
    deleteSection?: (formData: FormData) => Promise<void>
    createLesson?: (formData: FormData) => Promise<void>
    deleteLesson?: (formData: FormData) => Promise<void>
    createQuiz?: (formData: FormData) => Promise<void>
    deleteQuiz?: (formData: FormData) => Promise<void>
}

export default function CourseForm({
    course,
    categories,
    instructors,
    sections = [],
    lessons = [],
    quizzes = [],
    currentCategoryId = '',
    currentTags = '',
    action,
    createSection,
    deleteSection,
    createLesson,
    deleteLesson,
    createQuiz,
    deleteQuiz,
}: CourseFormProps) {
    // State
    const [showSaleDates, setShowSaleDates] = useState(!!(course?.sale_start || course?.sale_end))
    const [allowRepurchase, setAllowRepurchase] = useState(course?.allow_repurchase || false)
    const [instructorSearch, setInstructorSearch] = useState('')
    const [showInstructorDropdown, setShowInstructorDropdown] = useState(false)
    const [selectedInstructorId, setSelectedInstructorId] = useState(course?.instructor_id || '')
    const selectedInstructor = instructors.find(i => i.id === selectedInstructorId)
    const filteredInstructors = instructors.filter(i =>
        i.name.toLowerCase().includes(instructorSearch.toLowerCase())
    )

    // WYSIWYG ref
    const editorRef = useRef<HTMLDivElement>(null)
    const descriptionInputRef = useRef<HTMLInputElement>(null)

    const execCmd = useCallback((cmd: string, value?: string) => {
        document.execCommand(cmd, false, value)
        editorRef.current?.focus()
    }, [])

    // Sync WYSIWYG content to hidden input on form submit
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (descriptionInputRef.current && editorRef.current) {
            descriptionInputRef.current.value = editorRef.current.innerHTML
        }
    }

    // Curriculum state
    const [newSectionTitle, setNewSectionTitle] = useState('')
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
    const [addingTo, setAddingTo] = useState<{ sectionId: string; type: 'lesson' | 'quiz' | 'attachment' } | null>(null)
    const [newItemTitle, setNewItemTitle] = useState('')

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const getSectionItems = (sectionId: string) => {
        const sectionLessons = lessons.filter(l => l.section_id === sectionId).sort((a, b) => a.sort_order - b.sort_order)
        const sectionQuizzes = quizzes.filter(q => q.section_id === sectionId).sort((a, b) => a.sort_order - b.sort_order)
        return [...sectionLessons.map(l => ({ ...l, itemType: 'lesson' as const })), ...sectionQuizzes.map(q => ({ ...q, itemType: 'quiz' as const, lesson_type: 'quiz' }))]
            .sort((a, b) => a.sort_order - b.sort_order)
    }

    return (
        <form action={action} onSubmit={handleSubmit}>
            {course && <input type="hidden" name="course_id" value={course.id} />}
            <input type="hidden" name="description" ref={descriptionInputRef} defaultValue={course?.description || ''} />
            <input type="hidden" name="instructor_id" value={selectedInstructorId} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                    {/* ─── General Info ─── */}
                    <FormSection title="ข้อมูลทั่วไป" icon="info">
                        <FormField label="ชื่อคอร์ส" required>
                            <input type="text" name="name" required defaultValue={course?.name || ''} placeholder="เช่น ภาษาอังกฤษธุรกิจ Pro" className="form-input" />
                        </FormField>
                        <FormField label="Slug (URL)">
                            <input type="text" name="slug" defaultValue={course?.slug || ''} placeholder="สร้างอัตโนมัติจากชื่อ" className="form-input font-mono text-xs" />
                        </FormField>
                        <FormField label="รายละเอียด">
                            {/* WYSIWYG Toolbar */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                                    <button type="button" onClick={() => execCmd('bold')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Bold">
                                        <span className="text-sm font-bold">B</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd('italic')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Italic">
                                        <span className="text-sm italic">I</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd('underline')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Underline">
                                        <span className="text-sm underline">U</span>
                                    </button>
                                    <div className="w-px h-5 bg-gray-300 mx-1" />
                                    <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Bullet List">
                                        <MaterialIcon name="format_list_bulleted" className="text-base" />
                                    </button>
                                    <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Numbered List">
                                        <MaterialIcon name="format_list_numbered" className="text-base" />
                                    </button>
                                </div>
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="min-h-[120px] p-3 text-sm text-text-main focus:outline-none prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: course?.description || '' }}
                                />
                            </div>
                        </FormField>
                    </FormSection>

                    {/* ─── Course Features (สิ่งที่ได้รับ) — moved below description ─── */}
                    <FormSection title="สิ่งที่ได้รับ" icon="checklist">
                        <FormField label="รายการ (บรรทัดละข้อ)">
                            <textarea name="course_features" rows={5} defaultValue={course?.course_features || ''} placeholder={"วิดีโอ 10+ ชั่วโมง\nแบบฝึกหัดท้ายบท\nใบ Certificate\nเข้าถึงตลอดชีพ"} className="form-input resize-y" />
                            <p className="text-[10px] text-text-sub mt-1">แต่ละบรรทัดจะแสดงเป็น bullet</p>
                        </FormField>
                    </FormSection>

                    {/* ─── Pricing ─── */}
                    <FormSection title="ราคา" icon="payments">
                        <FormField label="ราคาปกติ (฿)">
                            <input type="number" name="price" step="0.01" min="0" defaultValue={course?.price || ''} placeholder="ว่าง = ฟรี (Free)" className="form-input" />
                            <p className="text-[10px] text-text-sub mt-1">หากไม่ระบุหรือใส่ 0 จะแสดงเป็น &quot;ฟรี&quot;</p>
                        </FormField>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-medium text-text-sub">ราคาลด (฿)</label>
                                <button
                                    type="button"
                                    onClick={() => setShowSaleDates(!showSaleDates)}
                                    className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
                                >
                                    <MaterialIcon name="schedule" className="text-sm" />
                                    {showSaleDates ? 'ซ่อนกำหนดการ' : 'ตั้งกำหนดการ'}
                                </button>
                            </div>
                            <input type="number" name="sale_price" step="0.01" min="0" defaultValue={course?.sale_price || ''} placeholder="ว่าง = ไม่ลด" className="form-input" />
                        </div>
                        {showSaleDates && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                <FormField label="เริ่มลดราคา">
                                    <input type="datetime-local" name="sale_start" defaultValue={course?.sale_start ? new Date(course.sale_start).toISOString().slice(0, 16) : ''} className="form-input" />
                                </FormField>
                                <FormField label="หมดเขตลดราคา">
                                    <input type="datetime-local" name="sale_end" defaultValue={course?.sale_end ? new Date(course.sale_end).toISOString().slice(0, 16) : ''} className="form-input" />
                                </FormField>
                            </div>
                        )}
                    </FormSection>

                    {/* ─── Access Duration ─── */}
                    <FormSection title="ระยะเวลาเข้าถึง" icon="schedule">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="ระยะเวลา">
                                <input type="number" name="access_duration_value" min="0" defaultValue={course?.access_duration_value || 0} className="form-input" />
                                <p className="text-[10px] text-text-sub mt-1">ใส่ 0 = ตลอดชีพ (Lifetime)</p>
                            </FormField>
                            <FormField label="หน่วย">
                                <select name="access_duration_unit" defaultValue={course?.access_duration_unit || 'day'} className="form-input">
                                    <option value="day">วัน</option>
                                    <option value="month">เดือน</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="space-y-2 mt-2">
                            <p className="text-xs font-medium text-text-sub">บล็อกเนื้อหา</p>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="block_on_expiry" id="block_on_expiry" defaultChecked={course?.block_on_expiry} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="block_on_expiry" className="text-sm text-text-sub">บล็อกเมื่อหมดเวลาเข้าถึง</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" name="block_on_completion" id="block_on_completion" defaultChecked={course?.block_on_completion} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="block_on_completion" className="text-sm text-text-sub">บล็อกเมื่อเรียนจบแล้ว</label>
                            </div>
                        </div>
                    </FormSection>

                    {/* ─── Repurchase ─── */}
                    <FormSection title="ซื้อซ้ำ" icon="replay">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="allow_repurchase" id="allow_repurchase" checked={allowRepurchase} onChange={e => setAllowRepurchase(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
                            <label htmlFor="allow_repurchase" className="text-sm text-text-sub">อนุญาตให้ซื้อซ้ำ</label>
                        </div>
                        {allowRepurchase && (
                            <FormField label="เมื่อซื้อซ้ำ">
                                <select name="repurchase_action" defaultValue={course?.repurchase_action || 'reset_progress'} className="form-input">
                                    <option value="reset_progress">ล้างความคืบหน้า — ผลการเรียนจะถูกลบ</option>
                                    <option value="keep_progress">เก็บความคืบหน้า — ผลการเรียนยังอยู่</option>
                                    <option value="open_popup">แสดง Popup — ให้ผู้เรียนเลือกเอง</option>
                                </select>
                            </FormField>
                        )}
                    </FormSection>

                    {/* ─── Course Settings ─── */}
                    <FormSection title="ตั้งค่าคอร์ส" icon="tune">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField label="ระดับ">
                                <select name="difficulty_level" defaultValue={course?.difficulty_level || 'beginner'} className="form-input">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </FormField>
                            <FormField label="จำนวนเรียนซ้ำ (Re-take)">
                                <input type="number" name="retake_count" min="0" defaultValue={course?.retake_count || 0} className="form-input" />
                                <p className="text-[10px] text-text-sub mt-1">0 = ไม่จำกัด</p>
                            </FormField>
                            <FormField label="จำนวนผู้เรียนสูงสุด">
                                <input type="number" name="max_students" min="0" defaultValue={course?.max_students || 0} className="form-input" />
                                <p className="text-[10px] text-text-sub mt-1">0 = ไม่จำกัด</p>
                            </FormField>
                        </div>
                        <FormField label="จำนวนผู้เรียน (แสดงอย่างเดียว)">
                            <input type="number" name="fake_students_enrolled" min="0" defaultValue={course?.fake_students_enrolled || 0} className="form-input" />
                            <p className="text-[10px] text-text-sub mt-1">แสดงเป็นตัวเลข ไม่ถูกนำไปคำนวณ</p>
                        </FormField>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="show_finish_button" id="show_finish_button" defaultChecked={course?.show_finish_button ?? true} className="w-4 h-4 accent-primary rounded" />
                            <label htmlFor="show_finish_button" className="text-sm text-text-sub">แสดงปุ่ม &quot;เรียนจบ&quot; ก่อนผ่านการประเมิน</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="no_enroll_requirement" id="no_enroll_requirement" defaultChecked={course?.no_enroll_requirement} className="w-4 h-4 accent-primary rounded" />
                            <label htmlFor="no_enroll_requirement" className="text-sm text-text-sub">ไม่ต้องสมัครสมาชิก — ดูเนื้อหาและทำแบบทดสอบได้เลย</label>
                        </div>
                    </FormSection>

                    {/* ─── Evaluation ─── */}
                    <FormSection title="การประเมินผล" icon="assessment">
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <p className="text-xs font-bold text-text-main">เงื่อนไขผ่านคอร์ส</p>
                            <div className="flex items-start gap-3 text-sm">
                                <MaterialIcon name="check_circle" className="text-green-500 text-lg mt-0.5" />
                                <div>
                                    <p className="font-medium text-text-main">เรียนครบ: 100% ของคอร์ส</p>
                                    <p className="text-[11px] text-text-sub">ผู้เรียนต้องเรียนจบทุกบทเรียน</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MaterialIcon name="quiz" className="text-primary text-lg mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-text-main">ทำแบบทดสอบท้ายบท: ได้คะแนนตั้งแต่ขั้นต่ำขึ้นไป</p>
                                    <p className="text-[11px] text-text-sub">คะแนนขั้นต่ำจะคำนวณจากจำนวนข้อ × เปอร์เซ็นต์ผ่านที่ตั้ง</p>
                                </div>
                            </div>
                        </div>
                        <FormField label="เปอร์เซ็นต์คะแนนผ่าน (%)">
                            <input type="number" name="passing_grade" min="0" max="100" step="0.01" defaultValue={course?.passing_grade || 80} className="form-input" />
                            <p className="text-[10px] text-text-sub mt-1">ตัวอย่าง: หากมี 20 ข้อ และตั้ง 80% → ต้องได้ 16 คะแนนขึ้นไป</p>
                        </FormField>
                        <FormField label="วิธีประเมิน">
                            <select name="evaluation_method" defaultValue={course?.evaluation_method || 'lessons'} className="form-input">
                                <option value="lessons">ประเมินจากบทเรียน (Evaluate via lessons)</option>
                                <option value="final_quiz">ประเมินจากแบบทดสอบปลายภาค (Final quiz)</option>
                                <option value="passed_quizzes">ประเมินจากแบบทดสอบที่ผ่าน (Passed quizzes)</option>
                                <option value="questions">ประเมินจากคำถาม (Questions)</option>
                                <option value="mark">ประเมินจากเครื่องหมาย (Mark)</option>
                            </select>
                        </FormField>
                    </FormSection>

                    {/* ─── Curriculum ─── */}
                    {(createSection || course) && (
                        <FormSection title="หลักสูตร (Curriculum)" icon="menu_book">
                            <p className="text-xs text-text-sub mb-3">{sections.length} บท · {lessons.length} บทเรียน · {quizzes.length} แบบทดสอบ</p>

                            <div className="space-y-3">
                                {sections.sort((a, b) => a.sort_order - b.sort_order).map(section => {
                                    const items = getSectionItems(section.id)
                                    const isExpanded = expandedSections[section.id] !== false
                                    return (
                                        <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                            {/* Section Header */}
                                            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50/60 cursor-pointer" onClick={() => toggleSection(section.id)}>
                                                <MaterialIcon name="drag_indicator" className="text-gray-400 text-base" />
                                                <MaterialIcon name="menu_book" className="text-primary text-base" />
                                                <span className="text-sm font-bold text-text-main flex-1">{section.title}</span>
                                                <span className="text-[10px] text-text-sub bg-white px-2 py-0.5 rounded-full">{items.length} items</span>
                                                <MaterialIcon name={isExpanded ? 'expand_less' : 'expand_more'} className="text-text-sub text-lg" />
                                                {deleteSection && (
                                                    <form action={deleteSection} className="inline">
                                                        <input type="hidden" name="section_id" value={section.id} />
                                                        <input type="hidden" name="course_id" value={course?.id || ''} />
                                                        <button type="submit" className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors" onClick={e => e.stopPropagation()}>
                                                            <MaterialIcon name="delete" className="text-base" />
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                            {section.description && isExpanded && (
                                                <div className="px-4 py-2 bg-gray-50/50 text-xs text-text-sub border-b border-gray-100">{section.description}</div>
                                            )}

                                            {/* Items */}
                                            {isExpanded && (
                                                <div className="divide-y divide-gray-100">
                                                    {items.map(item => {
                                                        const typeIcon = item.lesson_type === 'quiz' ? 'quiz' : item.lesson_type === 'attachment' ? 'attach_file' : item.lesson_type === 'video' ? 'play_circle' : 'description'
                                                        const typeColor = item.lesson_type === 'quiz' ? 'text-amber-500' : item.lesson_type === 'attachment' ? 'text-gray-500' : 'text-primary'
                                                        return (
                                                            <div key={item.id} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                                                <MaterialIcon name="drag_indicator" className="text-gray-300 text-sm" />
                                                                <MaterialIcon name={typeIcon} className={`${typeColor} text-base`} />
                                                                <span className="text-sm text-text-main flex-1">{item.title}</span>
                                                                {item.itemType === 'lesson' && deleteLesson && (
                                                                    <form action={deleteLesson} className="inline">
                                                                        <input type="hidden" name="lesson_id" value={item.id} />
                                                                        <input type="hidden" name="course_id" value={course?.id || ''} />
                                                                        <button type="submit" className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors">
                                                                            <MaterialIcon name="delete" className="text-sm" />
                                                                        </button>
                                                                    </form>
                                                                )}
                                                                {item.itemType === 'quiz' && deleteQuiz && (
                                                                    <form action={deleteQuiz} className="inline">
                                                                        <input type="hidden" name="quiz_id" value={item.id} />
                                                                        <input type="hidden" name="course_id" value={course?.id || ''} />
                                                                        <button type="submit" className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors">
                                                                            <MaterialIcon name="delete" className="text-sm" />
                                                                        </button>
                                                                    </form>
                                                                )}
                                                            </div>
                                                        )
                                                    })}

                                                    {/* Add item buttons */}
                                                    {addingTo?.sectionId === section.id ? (
                                                        <div className="px-4 py-3 bg-gray-50">
                                                            <form action={addingTo.type === 'quiz' ? createQuiz : createLesson} onSubmit={() => { setAddingTo(null); setNewItemTitle('') }}>
                                                                <input type="hidden" name="section_id" value={section.id} />
                                                                <input type="hidden" name="course_id" value={course?.id || ''} />
                                                                {addingTo.type !== 'quiz' && <input type="hidden" name="lesson_type" value={addingTo.type === 'attachment' ? 'attachment' : 'video'} />}
                                                                <div className="flex items-center gap-2">
                                                                    <input type="text" name={addingTo.type === 'quiz' ? 'title' : 'title'} value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder={`ชื่อ${addingTo.type === 'quiz' ? 'แบบทดสอบ' : addingTo.type === 'attachment' ? 'ไฟล์แนบ' : 'บทเรียน'}...`} className="form-input flex-1 text-sm" autoFocus />
                                                                    <button type="submit" className="px-3 py-2 bg-primary text-white text-xs rounded-lg font-bold hover:bg-primary-dark transition-colors">เพิ่ม</button>
                                                                    <button type="button" onClick={() => setAddingTo(null)} className="px-3 py-2 bg-gray-200 text-text-sub text-xs rounded-lg font-medium hover:bg-gray-300 transition-colors">ยกเลิก</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100">
                                                            {createLesson && (
                                                                <button type="button" onClick={() => setAddingTo({ sectionId: section.id, type: 'lesson' })} className="flex items-center gap-1 text-[11px] text-primary font-medium border border-primary/30 px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                                                                    <MaterialIcon name="description" className="text-sm" />
                                                                    New Lesson
                                                                </button>
                                                            )}
                                                            {createQuiz && (
                                                                <button type="button" onClick={() => setAddingTo({ sectionId: section.id, type: 'quiz' })} className="flex items-center gap-1 text-[11px] text-amber-600 font-medium border border-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                                                                    <MaterialIcon name="quiz" className="text-sm" />
                                                                    New Quiz
                                                                </button>
                                                            )}
                                                            {createLesson && (
                                                                <button type="button" onClick={() => setAddingTo({ sectionId: section.id, type: 'attachment' })} className="flex items-center gap-1 text-[11px] text-gray-500 font-medium border border-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                                                    <MaterialIcon name="attach_file" className="text-sm" />
                                                                    Attachment
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Add Section */}
                            {createSection && (
                                <div className="mt-4 flex items-center gap-2">
                                    <form action={createSection} onSubmit={() => setNewSectionTitle('')} className="flex items-center gap-2 flex-1">
                                        <input type="hidden" name="course_id" value={course?.id || ''} />
                                        <input type="text" name="title" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} placeholder="ชื่อบทใหม่..." className="form-input flex-1 text-sm" />
                                        <button type="submit" disabled={!newSectionTitle.trim()} className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-xs rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <MaterialIcon name="add" className="text-base" />
                                            เพิ่มบท
                                        </button>
                                    </form>
                                </div>
                            )}
                        </FormSection>
                    )}
                </div>

                {/* ─── RIGHT SIDEBAR ─── */}
                <div className="space-y-6">
                    <FormSection title="เผยแพร่" icon="publish">
                        <FormField label="สถานะ">
                            <select name="status" defaultValue={course?.status || 'draft'} className="form-input">
                                <option value="draft">ฉบับร่าง</option>
                                <option value="published">เผยแพร่</option>
                                {course && <option value="archived">เก็บถาวร</option>}
                            </select>
                        </FormField>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={course?.is_featured} className="w-4 h-4 accent-primary rounded" />
                            <label htmlFor="is_featured" className="text-sm text-text-sub">⭐ คอร์สแนะนำ</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="enable_reviews" id="enable_reviews" defaultChecked={course?.enable_reviews ?? true} className="w-4 h-4 accent-primary rounded" />
                            <label htmlFor="enable_reviews" className="text-sm text-text-sub">เปิดให้รีวิว</label>
                        </div>
                        {course?.published_at && (
                            <p className="text-xs text-text-sub mt-2">
                                เผยแพร่เมื่อ: {new Date(course.published_at).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        )}
                    </FormSection>

                    <FormSection title="รูปภาพหลัก" icon="image">
                        {course?.featured_image && (
                            <div className="mb-3">
                                <img src={course.featured_image} alt="" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                            </div>
                        )}
                        <FormField label="URL รูปภาพ">
                            <input type="url" name="featured_image" defaultValue={course?.featured_image || ''} placeholder="https://..." className="form-input" />
                        </FormField>
                    </FormSection>

                    <FormSection title="วิดีโอแนะนำ" icon="play_circle">
                        <FormField label="Embed URL (iframe)">
                            <input type="url" name="media_intro" defaultValue={course?.media_intro || ''} placeholder="https://youtube.com/embed/..." className="form-input" />
                        </FormField>
                    </FormSection>

                    {/* ─── Instructor (searchable) ─── */}
                    <FormSection title="ผู้สอน" icon="school">
                        <FormField label="เลือกผู้สอน">
                            <div className="relative">
                                <div className="flex items-center form-input cursor-text" onClick={() => setShowInstructorDropdown(true)}>
                                    {selectedInstructor && !showInstructorDropdown ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-sm">{selectedInstructor.name}</span>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedInstructorId(''); }} className="ml-auto text-gray-400 hover:text-red-500">
                                                <MaterialIcon name="close" className="text-sm" />
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={instructorSearch}
                                            onChange={e => { setInstructorSearch(e.target.value); setShowInstructorDropdown(true) }}
                                            onFocus={() => setShowInstructorDropdown(true)}
                                            placeholder="พิมพ์ค้นหาชื่อผู้สอน..."
                                            className="w-full outline-none bg-transparent text-sm"
                                        />
                                    )}
                                </div>
                                {showInstructorDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowInstructorDropdown(false)} />
                                        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                            <button type="button" onClick={() => { setSelectedInstructorId(''); setShowInstructorDropdown(false); setInstructorSearch('') }} className="w-full text-left px-3 py-2 text-sm text-text-sub hover:bg-gray-50 transition-colors">
                                                — ไม่ระบุ —
                                            </button>
                                            {filteredInstructors.map(inst => (
                                                <button key={inst.id} type="button" onClick={() => { setSelectedInstructorId(inst.id); setShowInstructorDropdown(false); setInstructorSearch('') }} className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors ${inst.id === selectedInstructorId ? 'bg-primary/10 text-primary font-medium' : 'text-text-main'}`}>
                                                    {inst.name}
                                                </button>
                                            ))}
                                            {filteredInstructors.length === 0 && (
                                                <p className="px-3 py-2 text-sm text-text-sub">ไม่พบผู้สอน</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </FormField>
                    </FormSection>

                    {course && (
                        <FormSection title="ใบรับรอง" icon="workspace_premium">
                            <div className="flex items-center gap-3 mb-3">
                                <input type="checkbox" name="has_certificate" id="has_certificate" defaultChecked={course.has_certificate} className="w-4 h-4 accent-primary rounded" />
                                <label htmlFor="has_certificate" className="text-sm text-text-sub">🎓 มีวุฒิบัตร</label>
                            </div>
                            <FormField label="Template URL">
                                <input type="url" name="certificate_template" defaultValue={course.certificate_template || ''} placeholder="https://..." className="form-input" />
                            </FormField>
                        </FormSection>
                    )}

                    <FormSection title="หมวดหมู่" icon="category">
                        <FormField label="เลือกหมวดหมู่">
                            <select name="category_id" defaultValue={currentCategoryId} className="form-input">
                                <option value="">— ไม่ระบุ —</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parent_id ? '— ' : ''}{cat.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                    </FormSection>

                    <FormSection title="แท็ก" icon="label">
                        <FormField label="แท็ก (คั่นด้วย ,)">
                            <input type="text" name="tags" defaultValue={currentTags} placeholder="TOEIC, ธุรกิจ, ไวยากรณ์" className="form-input" />
                        </FormField>
                    </FormSection>

                    <div className="flex flex-col gap-3">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm">
                            <MaterialIcon name="save" className="text-lg" />
                            {course ? 'อัปเดตคอร์ส' : 'บันทึกคอร์ส'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

// ─── Shared Sub-Components ───

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <MaterialIcon name={icon} className="text-primary text-lg" />
                <h3 className="font-bold text-sm text-text-main">{title}</h3>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-medium text-text-sub mb-1.5">
                {label}{required && <span className="text-secondary ml-0.5">*</span>}
            </label>
            {children}
        </div>
    )
}
