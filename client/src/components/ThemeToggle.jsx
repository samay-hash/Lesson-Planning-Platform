import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800 text-yellow-500 dark:text-cyan-400"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} size="lg" />
            </motion.div>
        </button>
    )
}

export default ThemeToggle
