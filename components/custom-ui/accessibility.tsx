'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const options = [
        { label: 'Light', value: 'light', icon: '☀️' },
        { label: 'Dark', value: 'dark', icon: '🌙' },
    ]

    const buttonClass =
        'p-3 text-xl rounded-full shadow-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:scale-105 transition-all'

    const handleLogout = async () => {
        try {
            // await axios.get('/api/logout')
            window.location.href = '/'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
            {open && (
                <div className="mb-2 flex flex-col items-end space-y-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setTheme(opt.value)
                                setOpen(false)
                            }}
                            className={buttonClass}
                            title={opt.label}
                        >
                            {opt.icon}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex space-x-2">
                <button
                    onClick={() => setOpen(!open)}
                    className={buttonClass}
                    title="Choose theme"
                >
                    🖥️
                </button>
            </div>
        </div>
    )
}