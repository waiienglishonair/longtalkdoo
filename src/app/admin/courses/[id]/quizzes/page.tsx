import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { createQuiz, deleteQuiz, createQuizQuestion, deleteQuizQuestion } from '../../actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default async function QuizzesPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: course } = await supabase
        .from('courses')
        .select('id, name')
        .eq('id', id)
        .single()

    if (!course) notFound()

    const { data: sections } = await supabase
        .from('course_sections')
        .select('id, title, sort_order')
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    const { data: quizzes } = await supabase
        .from('quizzes')
        .select(`
            *,
            course_sections ( title ),
            quiz_questions (*)
        `)
        .eq('course_id', id)
        .order('sort_order', { ascending: true })

    const sortedQuizzes = quizzes?.map(quiz => ({
        ...quiz,
        quiz_questions: ((quiz.quiz_questions as Record<string, unknown>[]) || []).sort(
            (a, b) => (a.sort_order as number) - (b.sort_order as number)
        ),
    })) || []

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/courses/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-text-sub">
                    <MaterialIcon name="arrow_back" className="text-xl" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-text-main">แบบทดสอบ</h1>
                    <p className="text-text-sub text-sm">{course.name}</p>
                </div>
                <span className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm text-text-sub">
                    <MaterialIcon name="quiz" className="text-sm text-amber-500" />
                    {sortedQuizzes.length} แบบทดสอบ
                </span>
            </div>

            {/* Tab nav */}
            <div className="flex border-b border-gray-200">
                <Link href={`/admin/courses/${id}`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors">
                    ข้อมูลคอร์ส
                </Link>
                <Link href={`/admin/courses/${id}/curriculum`} className="px-5 py-3 text-sm font-medium text-text-sub border-b-2 border-transparent hover:text-primary transition-colors">
                    เนื้อหา
                </Link>
                <Link href={`/admin/courses/${id}/quizzes`} className="px-5 py-3 text-sm font-bold text-primary border-b-2 border-primary">
                    แบบทดสอบ
                </Link>
            </div>

            {/* Quizzes list */}
            <div className="space-y-4">
                {sortedQuizzes.map((quiz, quizIndex) => {
                    const questions = quiz.quiz_questions as {
                        id: string; question_text: string; question_type: string;
                        options: string[] | null; correct_answer: string; explanation: string | null; points: number;
                    }[]
                    const sectionName = (quiz.course_sections as { title: string } | null)?.title
                    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0)

                    return (
                        <div key={quiz.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Quiz Header */}
                            <div className="px-5 py-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">
                                        {quizIndex + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-text-main">{quiz.title}</h3>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            {sectionName && (
                                                <span className="text-[10px] text-text-sub flex items-center gap-0.5">
                                                    <MaterialIcon name="folder" className="text-[10px]" /> {sectionName}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-text-sub">ผ่าน: {quiz.passing_score}%</span>
                                            {quiz.max_attempts > 0 && (
                                                <span className="text-[10px] text-text-sub">ทำได้: {quiz.max_attempts} ครั้ง</span>
                                            )}
                                            {quiz.time_limit_minutes && (
                                                <span className="text-[10px] text-text-sub">⏱ {quiz.time_limit_minutes} นาที</span>
                                            )}
                                            <span className="text-[10px] text-text-sub">📊 {totalPoints} คะแนน</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-text-sub bg-white px-2 py-1 rounded-lg border border-gray-100">
                                        {questions.length} คำถาม
                                    </span>
                                    {quiz.is_required && (
                                        <span className="text-[10px] font-bold text-secondary bg-red-50 px-2 py-0.5 rounded-full">บังคับ</span>
                                    )}
                                    <form action={deleteQuiz}>
                                        <input type="hidden" name="quiz_id" value={quiz.id} />
                                        <input type="hidden" name="course_id" value={id} />
                                        <button type="submit" className="p-1.5 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors" title="ลบแบบทดสอบ">
                                            <MaterialIcon name="delete" className="text-lg" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="divide-y divide-gray-50">
                                {questions.map((question, qIndex) => (
                                    <div key={question.id} className="px-5 py-3 hover:bg-gray-50/50 transition-colors group">
                                        <div className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-gray-100 text-text-sub flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                {qIndex + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-text-main font-medium">{question.question_text}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <QuestionTypeBadge type={question.question_type} />
                                                    <span className="text-[10px] text-text-sub">{question.points} คะแนน</span>
                                                    <span className="text-[10px] text-green-600 font-medium">
                                                        ✓ {question.correct_answer}
                                                    </span>
                                                </div>
                                                {question.options && question.options.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {question.options.map((opt, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-[11px] px-2 py-0.5 rounded-md ${opt === question.correct_answer
                                                                    ? 'bg-green-50 text-green-700 font-bold border border-green-200'
                                                                    : 'bg-gray-50 text-text-sub border border-gray-100'
                                                                    }`}
                                                            >
                                                                {String.fromCharCode(65 + i)}. {opt}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <form action={deleteQuizQuestion} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <input type="hidden" name="question_id" value={question.id} />
                                                <input type="hidden" name="course_id" value={id} />
                                                <button type="submit" className="p-1 rounded-lg text-gray-400 hover:text-secondary hover:bg-red-50 transition-colors" title="ลบคำถาม">
                                                    <MaterialIcon name="close" className="text-sm" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}

                                {questions.length === 0 && (
                                    <div className="px-5 py-6 text-center text-sm text-text-sub">
                                        ยังไม่มีคำถาม — เพิ่มคำถามด้านล่าง
                                    </div>
                                )}
                            </div>

                            {/* Add Question Form */}
                            <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                                <form action={createQuizQuestion} className="space-y-3">
                                    <input type="hidden" name="quiz_id" value={quiz.id} />
                                    <input type="hidden" name="course_id" value={id} />

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="question_text"
                                            required
                                            placeholder="พิมพ์คำถามใหม่..."
                                            className="flex-1 form-input text-sm"
                                        />
                                        <select name="question_type" className="form-input text-xs w-36">
                                            <option value="multiple_choice">ตัวเลือก (MC)</option>
                                            <option value="true_false">จริง/ไม่จริง</option>
                                            <option value="short_answer">ตอบสั้น</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" name="option_a" placeholder="A. ตัวเลือก A" className="form-input text-xs" />
                                        <input type="text" name="option_b" placeholder="B. ตัวเลือก B" className="form-input text-xs" />
                                        <input type="text" name="option_c" placeholder="C. ตัวเลือก C" className="form-input text-xs" />
                                        <input type="text" name="option_d" placeholder="D. ตัวเลือก D" className="form-input text-xs" />
                                    </div>

                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-medium text-text-sub mb-1">คำตอบที่ถูก *</label>
                                            <input type="text" name="correct_answer" required placeholder="พิมพ์คำตอบที่ถูกต้อง" className="form-input text-xs" />
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-[10px] font-medium text-text-sub mb-1">คะแนน</label>
                                            <input type="number" name="points" defaultValue={1} min={1} className="form-input text-xs" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-medium text-text-sub mb-1">คำอธิบาย</label>
                                            <input type="text" name="explanation" placeholder="อธิบายเฉลย (ไม่บังคับ)" className="form-input text-xs" />
                                        </div>
                                        <button type="submit" className="px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition-colors whitespace-nowrap">
                                            + เพิ่มคำถาม
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                })}

                {sortedQuizzes.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                            <MaterialIcon name="quiz" className="text-3xl text-amber-400" />
                        </div>
                        <p className="text-text-sub font-medium mb-1">ยังไม่มีแบบทดสอบ</p>
                        <p className="text-xs text-text-sub">สร้างแบบทดสอบท้ายบทด้านล่าง</p>
                    </div>
                )}
            </div>

            {/* Add Quiz Form */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-amber-300 overflow-hidden">
                <form action={createQuiz} className="p-5">
                    <input type="hidden" name="course_id" value={id} />
                    <h4 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
                        <MaterialIcon name="add_circle" className="text-amber-500 text-lg" />
                        สร้างแบบทดสอบใหม่
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">ชื่อแบบทดสอบ *</label>
                            <input type="text" name="title" required placeholder="เช่น แบบทดสอบท้ายบทที่ 1" className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">บทที่เกี่ยวข้อง</label>
                            <select name="section_id" className="form-input">
                                <option value="">— ทั่วไป (ไม่ระบุบท) —</option>
                                {sections?.map(s => (
                                    <option key={s.id} value={s.id}>บทที่ {s.sort_order + 1}: {s.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">คะแนนผ่าน (%)</label>
                            <input type="number" name="passing_score" defaultValue={80} min={0} max={100} className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">ทำได้กี่ครั้ง</label>
                            <input type="number" name="max_attempts" defaultValue={0} min={0} placeholder="0 = ไม่จำกัด" className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">เวลา (นาที)</label>
                            <input type="number" name="time_limit_minutes" min={0} placeholder="ไม่จำกัด" className="form-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-sub mb-1">คำอธิบาย</label>
                            <input type="text" name="description" placeholder="ไม่บังคับ" className="form-input" />
                        </div>
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">
                        + สร้างแบบทดสอบ
                    </button>
                </form>
            </div>
        </div>
    )
}

function QuestionTypeBadge({ type }: { type: string }) {
    const styles: Record<string, string> = {
        multiple_choice: 'bg-blue-50 text-blue-600',
        true_false: 'bg-purple-50 text-purple-600',
        short_answer: 'bg-gray-100 text-gray-600',
    }
    const labels: Record<string, string> = {
        multiple_choice: 'MC',
        true_false: 'T/F',
        short_answer: 'ตอบสั้น',
    }
    return (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles[type] || styles.short_answer}`}>
            {labels[type] || type}
        </span>
    )
}
