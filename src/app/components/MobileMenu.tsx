'use client'

import { useState } from 'react'
import Link from 'next/link'

function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

interface NavLink {
    href: string
    label: string
    active?: boolean
}

export default function MobileMenu({ links }: { links: NavLink[] }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setOpen(true)}
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors lg:hidden"
                aria-label="เปิดเมนู"
            >
                <MaterialIcon name="menu" />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Slide-out Menu */}
            <div
                className={`fixed top-0 left-0 z-[110] h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Menu Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform -rotate-3 shadow-sm">
                            <span className="text-white font-[var(--font-brand)] text-lg font-bold">L</span>
                        </div>
                        <span className="text-lg font-[var(--font-brand)] font-bold text-text-main">LongTalkDoo</span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text-sub"
                        aria-label="ปิดเมนู"
                    >
                        <MaterialIcon name="close" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.active
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-text-sub hover:bg-gray-100 hover:text-text-main'
                                }`}
                        >
                            {link.label}
                            {link.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100">
                    <p className="text-[10px] text-text-sub text-center">© 2026 LongTalkDoo</p>
                </div>
            </div>
        </>
    )
}
