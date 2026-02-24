'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/auth/actions'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none grid-notebook"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center transform -rotate-3 shadow-lg">
                            <span className="text-white font-[var(--font-brand)] text-2xl font-bold">L</span>
                        </div>
                        <h1 className="text-3xl font-[var(--font-brand)] font-bold text-text-main">LongTalkDoo</h1>
                    </Link>
                    <p className="text-text-sub text-sm mt-3">เข้าสู่ระบบเพื่อเริ่มเรียนภาษาอังกฤษ</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                        <MaterialIcon name="login" className="text-primary" />
                        เข้าสู่ระบบ
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-secondary text-sm rounded-xl p-3 mb-4 flex items-center gap-2">
                            <MaterialIcon name="error" className="text-lg" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">
                                อีเมล
                            </label>
                            <div className="relative">
                                <MaterialIcon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1.5">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <MaterialIcon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <MaterialIcon name="progress_activity" className="text-lg animate-spin" />
                                    กำลังเข้าสู่ระบบ...
                                </>
                            ) : (
                                <>
                                    เข้าสู่ระบบ
                                    <MaterialIcon name="arrow_forward" className="text-lg" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-text-sub mt-6">
                    ยังไม่มีบัญชี?{' '}
                    <Link href="/register" className="text-primary font-bold hover:underline">
                        สมัครสมาชิก
                    </Link>
                </p>
            </div>
        </div>
    )
}
