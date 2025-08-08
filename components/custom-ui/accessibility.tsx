'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const getNextTheme = () => {
        if (theme === 'light') return 'dark'
        if (theme === 'dark') return 'system'
        return 'light'
    }

    const getIcon = () => {
        if (theme === 'light') return '🌞'
        if (theme === 'dark') return '🌙'
        return '🖥️'
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const buttonClass =
        'p-3 text-xl rounded-full shadow-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:scale-105 transition-all'

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center space-y-2">
            {/* Theme toggle button */}
            <button
                onClick={() => setTheme(getNextTheme())}
                className={buttonClass}
                title={`Current theme: ${theme}`}
            >
                {getIcon()}
            </button>

            {/* Scroll to top button */}
            <button
                onClick={scrollToTop}
                className={buttonClass}
                title="Scroll to top"
            >
                ↑
            </button>
        </div>
    )
}