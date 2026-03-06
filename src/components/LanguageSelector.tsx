import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const languageOptions = {
  en: { flag: '🇺🇸', label: 'English' },
  fr: { flag: '🇫🇷', label: 'Français' },
  es: { flag: '🇪🇸', label: 'Español' },
}

export function LanguageSelector({ value, onChange, languages, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const containerRef = useRef(null)
  const itemRefs = useRef([])

  const selectedIndex = Math.max(
    0,
    languages.findIndex((language) => language === value),
  )

  useEffect(() => {
    setFocusedIndex(selectedIndex)
  }, [selectedIndex])

  useEffect(() => {
    if (!isOpen) return undefined

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])


  useEffect(() => {
    if (!isOpen) return
    itemRefs.current[focusedIndex]?.focus()
  }, [focusedIndex, isOpen])
  const onButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setFocusedIndex(selectedIndex)
      setIsOpen(true)
    }
  }

  const onMenuKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setFocusedIndex((prev) => (prev + 1) % languages.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setFocusedIndex((prev) => (prev - 1 + languages.length) % languages.length)
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setFocusedIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setFocusedIndex(languages.length - 1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const focusedLanguage = languages[focusedIndex]
      if (focusedLanguage) {
        onChange(focusedLanguage)
        setIsOpen(false)
      }
    }
  }

  return (
    <div className="language-selector" ref={containerRef}>
      <button
        type="button"
        className="language-trigger h-8 min-w-20 rounded-xl px-2 text-sm font-semibold text-app-text"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="language-trigger-content" aria-hidden="true">
          <span>{languageOptions[value]?.flag || '🌐'}</span>
          <span className="text-xs">▾</span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="language-menu"
            role="menu"
            aria-label={ariaLabel}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onKeyDown={onMenuKeyDown}
          >
            {languages.map((language, index) => {
              const option = languageOptions[language]
              const isSelected = language === value
              return (
                <li key={language} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    aria-label={`Switch language to ${option.label}`}
                    className={`language-menu-item ${isSelected ? 'is-active' : ''}`}
                    tabIndex={index === focusedIndex ? 0 : -1}
                    onFocus={() => setFocusedIndex(index)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    ref={(element) => {
                      itemRefs.current[index] = element
                    }}
                    onClick={() => {
                      onChange(language)
                      setIsOpen(false)
                    }}
                  >
                    <span>{option.flag}</span>
                    <span>{option.label}</span>
                    <span className="language-selected-indicator" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
