'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

type UserInfo = {
    displayName: string
    initial: string
    role: string
} | null

export default function HeaderAuth() {
    const [user, setUser] = useState<UserInfo>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        async function getUser() {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, role')
                    .eq('id', authUser.id)
                    .single()

                const displayName = profile?.display_name || authUser.email?.split('@')[0] || 'User'
                setUser({
                    displayName,
                    initial: displayName[0].toUpperCase(),
                    role: profile?.role || 'user',
                })
            }
            setLoading(false)
        }

        getUser()
    }, [])

    if (loading) {
        return (
            <div className="w-20 h-8 bg-white/20 rounded-lg animate-pulse"></div>
        )
    }

    if (user) {
        return (
            <Link href="/profile" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 transition-colors">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{user.initial}</span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.displayName}</span>
            </Link>
        )
    }

    return (
        <Link href="/login" className="bg-white text-primary text-sm font-bold px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
            เข้าสู่ระบบ
        </Link>
    )
}
